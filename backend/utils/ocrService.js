
import Tesseract from "tesseract.js";
import sharp from "sharp";
import FormData from "form-data";
import axios from "axios";
import Medicine from "../models/Medicine.js";

/**
 * Runs OCR on a prescription image.
 *
 * Uses OCR.space if OCR_SPACE_API_KEY exists.
 * Otherwise falls back to Tesseract.js.
 *
 * imageBuffer = req.file.buffer
 */
// export const extractTextFromImage = async (imageBuffer) => {
//   if (process.env.OCR_SPACE_API_KEY) {
//     try {
//       return await ocrSpaceExtract(imageBuffer);
//     } catch (err) {
//       console.error(
//         "⚠️ OCR.space failed, falling back to Tesseract.js:",
//         err.message
//       );
//     }
//   }
export const extractTextFromImage = async (imageBuffer) => {
  if (!process.env.OCR_SPACE_API_KEY) {
    throw new Error("OCR_SPACE_API_KEY is not configured");
  }

  return await ocrSpaceExtract(imageBuffer);
};
//   return tesseractExtract(imageBuffer);
// };


/**
 * Tesseract OCR
 * Works directly with the uploaded image buffer.
 */
const tesseractExtract = async (imageBuffer) => {
  const {
    data: { text },
  } = await Tesseract.recognize(imageBuffer, "eng", {
    logger: () => {},
  });

  return text;
};


/**
 * Compress image for OCR.space.
 *
 * OCR.space free API has a file-size limit,
 * so we resize/compress the image before sending.
 *
 * Returns a Buffer instead of creating a local file.
 */
const compressForOcrSpace = async (
  imageBuffer,
  maxBytes = 950 * 1024
) => {
  let quality = 85;
  let width = 1800;

  let buffer = await sharp(imageBuffer)
    .resize({
      width,
      withoutEnlargement: true,
    })
    .jpeg({
      quality,
    })
    .toBuffer();

  while (
    buffer.length > maxBytes &&
    (quality > 30 || width > 800)
  ) {
    if (quality > 30) {
      quality -= 15;
    } else {
      width -= 300;
    }

    buffer = await sharp(imageBuffer)
      .resize({
        width,
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
      })
      .toBuffer();
  }

  console.log(
    `📎 Compressed image for OCR.space: ${(
      buffer.length / 1024
    ).toFixed(0)}KB`
  );

  return buffer;
};


/**
 * OCR.space
 *
 * Sends the image directly from memory.
 */
const ocrSpaceExtract = async (imageBuffer) => {
  const compressedBuffer = await compressForOcrSpace(imageBuffer);

  const form = new FormData();

  form.append(
    "apikey",
    process.env.OCR_SPACE_API_KEY
  );

  form.append("language", "eng");

  form.append("OCREngine", "2");

  form.append("scale", "true");

  form.append("detectOrientation", "true");

  form.append(
    "file",
    compressedBuffer,
    {
      filename: "prescription.jpg",
      contentType: "image/jpeg",
    }
  );

  const { data } = await axios.post(
    "https://api.ocr.space/parse/image",
    form,
    {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    }
  );

  if (data.IsErroredOnProcessing) {
    throw new Error(
      data.ErrorMessage?.[0] ||
        data.ErrorMessage ||
        "OCR.space processing error"
    );
  }

  return data.ParsedResults?.[0]?.ParsedText || "";
};


/* =========================================================
   MEDICINE EXTRACTION
   ========================================================= */

const levenshtein = (a, b) => {
  const dp = Array.from(
    { length: a.length + 1 },
    () => new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 +
            Math.min(
              dp[i - 1][j - 1],
              dp[i - 1][j],
              dp[i][j - 1]
            );
    }
  }

  return dp[a.length][b.length];
};


const normalize = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]/g, "");


const isCloseMatch = (candidate, target) => {
  if (!candidate || !target || candidate.length < 4) {
    return false;
  }

  if (candidate === target) {
    return true;
  }

  const maxDist =
    target.length <= 6
      ? 1
      : target.length <= 10
      ? 2
      : 3;

  return levenshtein(candidate, target) <= maxDist;
};


const DOSAGE_REGEX =
  /(\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml|iu))/i;


const FREQUENCY_REGEX =
  /(\d-\d-\d|\bOD\b|\bBD\b|\bBID\b|\bTID\b|\bQID\b|once daily|twice daily|thrice daily|every \d+ hours?|as needed|SOS)/i;


/**
 * Matches OCR text with medicines in MongoDB.
 */
export const parseMedicinesFromText = async (rawText) => {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 2);

  const allMedicines = await Medicine.find(
    {},
    "name genericName aliases commonDosages usedFor frequency"
  );

  const results = [];
  const seen = new Set();

  for (const line of lines) {
    const words = line
      .split(/\s+/)
      .filter(Boolean);

    const candidates = [];

    for (let i = 0; i < words.length; i++) {
      candidates.push(normalize(words[i]));

      if (i + 1 < words.length) {
        candidates.push(
          normalize(words[i] + words[i + 1])
        );
      }
    }

    const match = allMedicines.find((med) => {
      const names = [
        med.name,
        med.genericName,
        ...(med.aliases || []),
      ]
        .filter(Boolean)
        .map(normalize);

      return names.some((n) =>
        candidates.some((c) =>
          isCloseMatch(c, n)
        )
      );
    });

    if (match && !seen.has(match.name)) {
      const dosageMatch =
        line.match(DOSAGE_REGEX);

      const freqMatch =
        line.match(FREQUENCY_REGEX);

      results.push({
        name: match.name,

        dosage: dosageMatch
          ? dosageMatch[0]
          : match.commonDosages?.[0] ||
            "Not detected",

        frequency: freqMatch
          ? freqMatch[0]
          : match.frequency ||
            "As prescribed",

        disease: match.usedFor || [],

        matched: true,
      });

      seen.add(match.name);
    }
  }

  return results;
};


/**
 * Optional AI extraction.
 */
export const aiExtract = async (rawText) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY not set - falling back to regex/dictionary extraction"
    );
  }

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },

      body: JSON.stringify({
        model: "gpt-4o-mini",

        messages: [
          {
            role: "system",
            content:
              "Extract medicines from this OCR'd doctor's prescription text. " +
              'Return ONLY a JSON array like [{"name":"","dosage":"","frequency":"","disease":[""]}]. ' +
              "No explanation, no markdown fences.",
          },

          {
            role: "user",
            content: rawText,
          },
        ],

        temperature: 0,
      }),
    }
  );

  const data = await response.json();

  const content =
    data.choices?.[0]?.message?.content?.trim() ||
    "[]";

  return JSON.parse(
    content.replace(/```json|```/g, "")
  );
};
