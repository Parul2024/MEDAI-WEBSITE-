import mongoose from "mongoose";

const extractedMedicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String, default: "Not detected" },
    frequency: { type: String, default: "As prescribed" },
    disease: [{ type: String }],
    matched: { type: Boolean, default: false }, // true if matched against Medicine collection
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    rawText: { type: String }, // full OCR output
    medicines: [extractedMedicineSchema],
    doctorName: { type: String },
    notes: { type: String },
    status: { type: String, enum: ["processing", "done", "failed"], default: "processing" },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
