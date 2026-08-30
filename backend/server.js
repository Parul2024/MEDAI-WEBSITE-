
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