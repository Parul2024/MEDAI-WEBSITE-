import asyncHandler from "express-async-handler";

// Curated wellness content. Swap/extend with a live API - e.g. Ninjas Quotes API
// or Nutritionix - if you want it to rotate dynamically (see README "APIs" section).
const TIPS = [
  { category: "Hydration", tip: "Drink a glass of water right after waking up to kickstart your metabolism.", icon: "droplet" },
  { category: "Sleep", tip: "Keep a consistent sleep schedule, even on weekends, to regulate your body clock.", icon: "moon" },
  { category: "Movement", tip: "Take a 5-minute walk every hour if you sit for long stretches during the day.", icon: "activity" },
  { category: "Nutrition", tip: "Add one extra serving of vegetables to your plate at lunch today.", icon: "leaf" },
  { category: "Mindfulness", tip: "Try 3 minutes of slow breathing before checking your phone in the morning.", icon: "wind" },
  { category: "Posture", tip: "Set a reminder to check and correct your posture every 30 minutes while working.", icon: "user" },
  { category: "Medication", tip: "Take medicines at the same time daily - it improves how well they work.", icon: "clock" },
  { category: "Eyes", tip: "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.", icon: "eye" },
];

// @route GET /api/wellness/tips
export const getWellnessTips = asyncHandler(async (req, res) => {
  const shuffled = [...TIPS].sort(() => Math.random() - 0.5);
  res.json(shuffled);
});

// @route GET /api/wellness/tip-of-the-day
export const getTipOfTheDay = asyncHandler(async (req, res) => {
  const dayIndex = new Date().getDate() % TIPS.length;
  res.json(TIPS[dayIndex]);
});
