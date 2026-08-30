import express from "express";
import { getWellnessTips, getTipOfTheDay } from "../controllers/wellnessController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/tips", protect, getWellnessTips);
router.get("/tip-of-the-day", protect, getTipOfTheDay);

export default router;
