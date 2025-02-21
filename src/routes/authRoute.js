import express from "express";

import { authenticateToken } from "../middlewares/AuthMiddleware.js";
import {
  register,
  login,
  logout,
  getUserProfile,
} from "../controllers/authController.js";
const authRouter = express.Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);

authRouter.route("/profile").get(authenticateToken, getUserProfile); // Protected profile route
authRouter.route("/logout").post(logout);

export default authRouter;
