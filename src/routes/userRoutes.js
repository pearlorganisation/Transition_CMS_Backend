import express from "express";
import { authenticateToken } from "../middlewares/AuthMiddleware.js";
import {
  forgotPassword,
  getUserProfile,
  updateUserDetails,
} from "../controllers/userController.js";

const router = express.Router();

router
  .route("/profile")
  .get(authenticateToken, getUserProfile)
  .patch(authenticateToken, updateUserDetails); // Protected profile route

router.route("/forgot-password").post(forgotPassword);

export default router;
