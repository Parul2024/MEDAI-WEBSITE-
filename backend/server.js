
import "dotenv/config";

import express from "express";
import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import { startReminderScheduler } from "./utils/reminderScheduler.js";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// -------------------------
// Middleware
// -------------------------

const allowedOrigins = [
  "https://med-ai-website-snowy.vercel.app",
  "https://med-ai-website-fx7er5lj8-parul-k-projects.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked:", origin);
      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// MongoDB
// -------------------------

connectDB();
startReminderScheduler();

// -------------------------
// Static uploads
// -------------------------

// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads"))
// );

// -------------------------
// Health check
// -------------------------

app.get("/", (req, res) => {
  res.json({
    message: "MedAI API is running...",
    database:
      process.env.MONGO_URI && process.env.MONGO_URI.length > 0
        ? "configured"
        : "not configured",
  });
});
app.get("/api/test-email", async (req, res) => {
  try {
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MedAI" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "MedAI Test Email",
      text: "Email system is working!",
    });

    res.json({
      success: true,
      message: "Test email sent",
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// -------------------------
// Routes
// -------------------------

app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/wellness", wellnessRoutes);

// -------------------------
// Error handling
// -------------------------

app.use(notFound);
app.use(errorHandler);

// -------------------------
// Export for Vercel
// -------------------------

export default app;
