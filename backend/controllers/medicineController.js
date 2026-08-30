import asyncHandler from "express-async-handler";
import Medicine from "../models/Medicine.js";

// @route GET /api/medicines/search?q=paracetamol
export const searchMedicines = asyncHandler(async (req, res) => {
  const q = req.query.q || "";
  if (!q.trim()) return res.json([]);

  const results = await Medicine.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { genericName: { $regex: q, $options: "i" } },
      { aliases: { $regex: q, $options: "i" } },
      { usedFor: { $regex: q, $options: "i" } },
    ],
  }).limit(15);

  res.json(results);
});

// @route GET /api/medicines/:id
export const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }
  res.json(medicine);
});
