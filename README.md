# MedAI — Prescription Reader, Medicine Info, Reminders & Wellness

Full-stack MERN app (MongoDB, Express, React, Node). Upload a photo of a doctor's
prescription and MedAI reads it via OCR, matches each medicine against a database
to show dosage/what-it-treats, lets you set dose reminders, and shows daily
wellness tips.

Inspired by [Parul2024/MedAI](https://github.com/Parul2024/MedAI) (Flask + Azure
Vision + medaCy) — rebuilt here as a MERN stack with a free, no-key-required OCR
pipeline by default.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS, React Router, Axios, lucide-react icons
- **Backend:** Node + Express, JWT auth, Multer (image upload), Tesseract.js (OCR), node-cron (reminders)
- **Database:** MongoDB (Atlas free tier or local)

## Project structure

```
medai/
  backend/
    config/db.js
    models/        User, Medicine, Prescription, Reminder
    controllers/    auth, prescription, medicine, reminder, wellness
    routes/
    middleware/     auth, error handling, multer upload
    utils/          ocrService.js (OCR + extraction), reminderScheduler.js, seedMedicines.js
    server.js
  frontend/
    src/
      pages/         Login, Register, Dashboard, UploadPrescription, Reminders, Wellness
      components/    Navbar, MedicineResultCard, ReminderModal, ProtectedRoute
      context/       AuthContext
      api/axios.js
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET at minimum
npm run seed               # seeds a starter medicine database (8 common meds)
npm run dev                 # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so
no CORS config is needed locally.

### MongoDB

Easiest option: create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register),
create a database user, allow your IP (or `0.0.0.0/0` for dev), and paste the
connection string into `MONGO_URI`. Or run MongoDB locally and use
`mongodb://localhost:27017/medai`.

## How prescription reading works

1. User uploads an image → stored via Multer in `backend/uploads/prescriptions`.
2. `ocrService.js` runs **Tesseract.js** (free, runs locally, no API key) to turn
   the image into raw text.
3. Each line of OCR text is matched against the `Medicine` collection (name,
   generic name, and common brand aliases) and dosage/frequency are pulled out
   with regex.
4. Matched medicines (name, dosage, frequency, what it treats) are saved on the
   `Prescription` document and returned to the frontend.
5. From any detected medicine, the user can tap **"Remind me"** to create a
   `Reminder` with one or more daily times; `node-cron` checks every minute and
   sends a reminder (email if SMTP is configured, otherwise logs to console —
   swap in the push-notification approach below for a real app).

## Suggested APIs (with notes on keys)

**OCR — reading the prescription image**
| API | Key needed? | Notes |
|---|---|---|
| **Tesseract.js** (used by default) | No | Free, runs in Node, decent on printed text, weaker on handwriting |
| [OCR.space](https://ocr.space/ocrapi) | Yes (free tier: 25k req/mo) | Easiest drop-in upgrade, better accuracy than Tesseract |
| [Google Cloud Vision API](https://cloud.google.com/vision/docs/ocr) | Yes (pay-as-you-go, free tier available) | Best general OCR accuracy |
| [Azure AI Vision — Read API](https://azure.microsoft.com/en-us/products/ai-services/ai-vision) | Yes | Same one the reference repo uses; strong on handwriting |

**Extracting medicine name / dosage / frequency from messy OCR text**
| API | Key needed? | Notes |
|---|---|---|
| Regex + local dictionary (used by default, see `ocrService.js`) | No | Works well once your `Medicine` collection is populated |
| [OpenAI API](https://platform.openai.com/docs/api-reference) (`gpt-4o-mini`) | Yes | Drop-in `aiExtract()` function is already stubbed in `ocrService.js` — much more robust with messy/handwritten OCR output |

**Medicine / drug reference data (dosage, uses, interactions)**
| API | Key needed? | Notes |
|---|---|---|
| [RxNorm API](https://lhncbc.nlm.nih.gov/RxNav/APIs/RxNormAPIs.html) (NIH) | No | Free, normalizes drug names, great for seeding your `Medicine` collection |
| [OpenFDA Drug API](https://open.fda.gov/apis/drug/) | Optional (higher rate limit with key) | Label info, side effects, warnings |
| [MedlinePlus Connect](https://medlineplus.gov/connect/overview.html) | No | Consumer-friendly drug/condition summaries, good for "what is this used for" text |

**Reminders / notifications**
| API | Key needed? | Notes |
|---|---|---|
| Email via Nodemailer + Gmail SMTP (used by default) | Yes (app password) | Simplest to set up |
| [web-push](https://www.npmjs.com/package/web-push) (VAPID keys) | Self-generated, free | Real browser push notifications, no third party |
| [Twilio SMS](https://www.twilio.com/docs/sms) | Yes (paid) | For SMS reminders |
| [OneSignal](https://onesignal.com/) | Yes (free tier) | Managed push notifications, simpler than raw web-push |

**Wellness content (optional, to make tips dynamic instead of curated)**
| API | Key needed? | Notes |
|---|---|---|
| [Ninjas Quotes/Health API](https://api-ninjas.com/api/quotes) | Yes (free tier) | Rotating motivational/health tips |
| [Nutritionix API](https://www.nutritionix.com/business/api) | Yes | If you want to add nutrition-specific tips |

None of these keys are included here — sign up for the free tiers above and drop
them into `backend/.env` (see `.env.example` for every variable name already
wired up in the code).

## Design

Tailwind CSS with a custom "pine + sand" clinical palette (deep pine green,
warm sand/cream, clay accent) defined in `tailwind.config.js` — deliberately
avoiding the generic AI-app look. Fraunces (display) + Inter (body) from Google
Fonts for a calm, trustworthy feel appropriate for a health product.

## Security notes before going to production

- Add rate limiting (`express-rate-limit`) on `/api/auth` and `/api/prescriptions/upload`.
- Store uploaded images in cloud storage (S3/Cloudinary) instead of local disk.
- This app is for informational/reminder purposes only — add a visible
  disclaimer that it does not replace professional medical advice.
- Validate/sanitize all user input server-side (basic validation is included,
  extend as needed).
