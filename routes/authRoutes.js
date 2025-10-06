import express from "express";
import { getUserProfile, loginUser,me,updateUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/login", loginUser);
authRoutes.post("/me", me);
authRoutes.get("/getUserProfile",protect, getUserProfile);
authRoutes.put("/updateUserProfile",protect, updateUserProfile);

export default authRoutes;
