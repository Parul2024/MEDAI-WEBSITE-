import express from "express";
import { searchMedicines, getMedicineById } from "../controllers/medicineController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchMedicines);
router.get("/:id", protect, getMedicineById);

export default router;
