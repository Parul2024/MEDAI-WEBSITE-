import express from "express";
import {
  uploadPrescription,
  getPrescriptions,
  getPrescriptionById,
  deletePrescription,
} from "../controllers/prescriptionController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("prescriptionImage"), uploadPrescription);
router.get("/", protect, getPrescriptions);
router.get("/:id", protect, getPrescriptionById);
router.delete("/:id", protect, deletePrescription);

export default router;
