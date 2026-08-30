import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// @route POST /api/auth/register
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, age, gender } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password, age, gender });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @route POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @route PUT /api/auth/me
export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const { name, age, gender, knownAllergies } = req.body;
  user.name = name ?? user.name;
  user.age = age ?? user.age;
  user.gender = gender ?? user.gender;
  user.knownAllergies = knownAllergies ?? user.knownAllergies;
  const updated = await user.save();
  res.json(updated);
});
