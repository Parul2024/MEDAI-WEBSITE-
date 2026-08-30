import mongoose from "mongoose";

// Local reference collection - seed it from RxNorm / OpenFDA (see utils/seedMedicines.js)
// so prescription OCR text can be matched against real dosage & disease-use data.
const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true, trim: true },
    genericName: { type: String, trim: true },
    aliases: [{ type: String, trim: true }], // brand names / common misspellings for OCR fuzzy match
    commonDosages: [{ type: String }], // e.g. ["250mg", "500mg"]
    usedFor: [{ type: String }], // diseases / conditions it treats
    frequency: { type: String, default: "As prescribed" },
    sideEffects: [{ type: String }],
    warnings: [{ type: String }],
    rxNormId: { type: String },
  },
  { timestamps: true }
);

medicineSchema.index({ name: "text", aliases: "text", genericName: "text" });

export default mongoose.model("Medicine", medicineSchema);
