import asyncHandler from "express-async-handler";
import Reminder from "../models/Reminder.js";

// @route POST /api/reminders
export const createReminder = asyncHandler(async (req, res) => {
  const { medicineName, dosage, times, startDate, endDate, prescription } = req.body;

  if (!medicineName || !times?.length) {
    res.status(400);
    throw new Error("medicineName and at least one time are required");
  }

  const reminder = await Reminder.create({
    user: req.user._id,
    medicineName,
    dosage,
    times,
    startDate,
    endDate,
    prescription,
  });

  res.status(201).json(reminder);
});

// @route GET /api/reminders
export const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(reminders);
});

// @route PUT /api/reminders/:id
export const updateReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user._id });
  if (!reminder) {
    res.status(404);
    throw new Error("Reminder not found");
  }
  Object.assign(reminder, req.body);
  const updated = await reminder.save();
  res.json(updated);
});

// @route DELETE /api/reminders/:id
export const deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!reminder) {
    res.status(404);
    throw new Error("Reminder not found");
  }
  res.json({ message: "Reminder deleted" });
});
