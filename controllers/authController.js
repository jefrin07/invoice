import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if user exists
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return res.status(404).json({ message: "User not found" });

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid email or password" });

  // Create JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "365d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  // req.user should be set by auth middleware
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(req.user.id).select("-password"); // exclude password

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
});
export const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    address: req.user.address,
    phone: req.user.phone,
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  // req.user is set by protect middleware
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { name, address, phone } = req.body;

  // Basic validation
  if (!name || !address || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update fields
  user.name = name;
  user.address = address;
  user.phone = phone;

  // Save updated user
  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    address: updatedUser.address,
    phone: updatedUser.phone,
  });
});
