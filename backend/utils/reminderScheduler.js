import cron from "node-cron";
import nodemailer from "nodemailer";
import Reminder from "../models/Reminder.js";
import User from "../models/User.js";

const transporter =
  process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    : null;

const sendReminderEmail = async (user, reminder) => {
  if (!transporter) {
    console.log(`🔔 [reminder] ${user.email} → take ${reminder.medicineName} (${reminder.dosage || ""})`);
    return;
  }
  await transporter.sendMail({
    from: `"MedAI" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `💊 Time to take ${reminder.medicineName}`,
    html: `<p>Hi ${user.name},</p><p>It's time to take <b>${reminder.medicineName}</b> ${
      reminder.dosage ? `(${reminder.dosage})` : ""
    }.</p><p>Stay healthy! - MedAI</p>`,
  });
};

// Runs every minute, checks whether "now" matches any active reminder's time slots.
export const startReminderScheduler = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const hhmm = now.toTimeString().slice(0, 5); // "HH:MM"

    try {
      const dueReminders = await Reminder.find({ active: true, times: hhmm }).populate("user");
      for (const reminder of dueReminders) {
        if (reminder.endDate && now > reminder.endDate) continue;
        await sendReminderEmail(reminder.user, reminder);
        reminder.lastSentAt = now;
        await reminder.save();
      }
    } catch (err) {
      console.error("Reminder scheduler error:", err.message);
    }
  });

  console.log("⏰ Reminder scheduler started");
};
