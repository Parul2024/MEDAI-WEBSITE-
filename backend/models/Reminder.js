import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medicineName: { type: String, required: true },
    dosage: { type: String },
    times: [{ type: String, required: true }], // ["08:00", "14:00", "21:00"] 24h format
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    active: { type: Boolean, default: true },
    lastSentAt: { type: Date },
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
