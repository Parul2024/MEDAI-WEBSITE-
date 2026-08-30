import asyncHandler from "express-async-handler";
import Prescription from "../models/Prescription.js";
import cloudinary from "../config/cloudinary.js";

import {
  extractTextFromImage,
  parseMedicinesFromText,
} from "../utils/ocrService.js";

// =========================================================
// UPLOAD PRESCRIPTION
// POST /api/prescriptions/upload
// =========================================================
export const uploadPrescription = asyncHandler(async (req, res) => {
  console.log("📄 Prescription upload request");

  // Check whether a file was uploaded
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a prescription image");
  }

  console.log("📦 File received:", {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
    hasBuffer: !!req.file.buffer,
  });

  // Make sure Multer provided the image buffer
  if (!req.file.buffer) {
    res.status(500);
    throw new Error(
      "Uploaded file buffer is unavailable. Check upload middleware."
    );
  }

  // =========================================================
  // UPLOAD IMAGE TO CLOUDINARY
  // =========================================================

  console.log("☁️ Uploading image to Cloudinary...");

  const cloudinaryResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "medai/prescriptions",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(req.file.buffer);
  });

  const imageUrl = cloudinaryResult.secure_url;

  console.log("✅ Cloudinary upload successful");
  console.log("☁️ Image URL:", imageUrl);

  // =========================================================
  // CREATE PRESCRIPTION RECORD
  // =========================================================

  const prescription = await Prescription.create({
    user: req.user._id,
    imageUrl,
    status: "processing",
  });

  console.log("📝 Prescription created:", prescription._id);

  // =========================================================
  // OCR PROCESSING
  // =========================================================

  try {
    console.log("🔍 Starting OCR...");

    // IMPORTANT:
    // Use buffer instead of req.file.path.
    // Vercel has a read-only filesystem.
    const rawText = await extractTextFromImage(req.file.buffer);

    console.log("✅ OCR completed");
    console.log("📝 OCR text length:", rawText.length);

    // =======================================================
    // MEDICINE EXTRACTION
    // =======================================================

    console.log("💊 Matching medicines...");

    const medicines = await parseMedicinesFromText(rawText);

    console.log("💊 Medicines found:", medicines.length);

    // =======================================================
    // SAVE RESULTS
    // =======================================================

    prescription.rawText = rawText;
    prescription.medicines = medicines;
    prescription.status = "done";

    await prescription.save();

    console.log("✅ Prescription processed successfully");

    return res.status(201).json(prescription);
  } catch (error) {
    console.error("❌ OCR processing failed:", error.message);

    // Save failed status instead of crashing the function
    prescription.status = "failed";

    await prescription.save();

    return res.status(201).json({
      ...prescription.toObject(),
      rawText: "",
      medicines: [],
      ocrError: error.message,
    });
  }
});


// =========================================================
// GET ALL PRESCRIPTIONS
// GET /api/prescriptions
// =========================================================
export const getPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find({
    user: req.user._id,
  }).sort({
    createdAt: -1,
  });

  res.json(prescriptions);
});


// =========================================================
// GET SINGLE PRESCRIPTION
// GET /api/prescriptions/:id
// =========================================================
export const getPrescriptionById = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!prescription) {
    res.status(404);
    throw new Error("Prescription not found");
  }

  res.json(prescription);
});


// =========================================================
// DELETE PRESCRIPTION
// DELETE /api/prescriptions/:id
// =========================================================
export const deletePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!prescription) {
    res.status(404);
    throw new Error("Prescription not found");
  }

  res.json({
    message: "Prescription deleted",
  });
});