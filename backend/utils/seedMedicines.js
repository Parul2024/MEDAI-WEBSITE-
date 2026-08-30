// Seeds the local Medicine collection with a small starter dataset so OCR
// matching works out of the box. Run: npm run seed
// For a production dataset, pull from RxNorm / OpenFDA (see README).
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Medicine from "../models/Medicine.js";

const seedData = [
  {
    name: "Paracetamol",
    genericName: "Acetaminophen",
    aliases: ["Tylenol", "Crocin", "Dolo", "Panadol"],
    commonDosages: ["500mg", "650mg"],
    usedFor: ["Fever", "Mild pain", "Headache"],
    frequency: "Every 6-8 hours",
    sideEffects: ["Nausea", "Liver strain in high doses"],
    warnings: ["Do not exceed 4g per day", "Avoid with heavy alcohol use"],
  },
  {
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    aliases: ["Amoxil", "Novamox"],
    commonDosages: ["250mg", "500mg"],
    usedFor: ["Bacterial infections", "Throat infection", "UTI"],
    frequency: "Every 8 hours",
    sideEffects: ["Diarrhea", "Rash", "Nausea"],
    warnings: ["Complete the full course", "Avoid if allergic to penicillin"],
  },
  {
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    aliases: ["Advil", "Brufen", "Motrin"],
    commonDosages: ["200mg", "400mg"],
    usedFor: ["Pain", "Inflammation", "Fever"],
    frequency: "Every 6-8 hours with food",
    sideEffects: ["Stomach upset", "Heartburn"],
    warnings: ["Avoid on empty stomach", "Avoid with kidney disease"],
  },
  {
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    aliases: ["Glucophage", "Glycomet"],
    commonDosages: ["500mg", "1000mg"],
    usedFor: ["Type 2 Diabetes"],
    frequency: "Twice daily with meals",
    sideEffects: ["GI upset", "Vitamin B12 deficiency (long term)"],
    warnings: ["Monitor kidney function"],
  },
  {
    name: "Amlodipine",
    genericName: "Amlodipine Besylate",
    aliases: ["Norvasc", "Amlong"],
    commonDosages: ["2.5mg", "5mg", "10mg"],
    usedFor: ["Hypertension", "Angina"],
    frequency: "Once daily",
    sideEffects: ["Swelling in ankles", "Dizziness"],
    warnings: ["Rise slowly from sitting/lying to avoid dizziness"],
  },
  {
    name: "Azithromycin",
    genericName: "Azithromycin",
    aliases: ["Zithromax", "Azithral"],
    commonDosages: ["250mg", "500mg"],
    usedFor: ["Respiratory infection", "Ear infection", "Throat infection"],
    frequency: "Once daily",
    sideEffects: ["Nausea", "Diarrhea"],
    warnings: ["Complete the full course even if symptoms improve"],
  },
  {
    name: "Cetirizine",
    genericName: "Cetirizine Hydrochloride",
    aliases: ["Zyrtec", "Alerid"],
    commonDosages: ["5mg", "10mg"],
    usedFor: ["Allergies", "Hay fever", "Hives"],
    frequency: "Once daily",
    sideEffects: ["Drowsiness", "Dry mouth"],
    warnings: ["May cause drowsiness - avoid driving if affected"],
  },
  {
    name: "Omeprazole",
    genericName: "Omeprazole",
    aliases: ["Prilosec", "Omez"],
    commonDosages: ["20mg", "40mg"],
    usedFor: ["Acid reflux", "GERD", "Peptic ulcer"],
    frequency: "Once daily before breakfast",
    sideEffects: ["Headache", "Abdominal pain"],
    warnings: ["Long-term use may affect bone density"],
  },
];

const run = async () => {
  await connectDB();
  await Medicine.deleteMany({});
  await Medicine.insertMany(seedData);
  console.log(`✅ Seeded ${seedData.length} medicines`);
  mongoose.connection.close();
};

run();
