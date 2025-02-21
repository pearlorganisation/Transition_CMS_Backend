import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";

dotenv.config();

/**--------------------------------signup----------------------------------- */
export const register = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "user already exists" });
  }
  //
  const user = new User({
    name,
    email,
    phoneNumber,
    password,
  });
  await user.save();

  // Respond to the client
  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      name: user.name,
      phone: user.phoneNumber,
      email: user.email,
    },
  });
});

/**------------------------------------------------------------login------------------------------------------------------------*/
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const isValidPassword = await user.matchPassword(password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials" }); // 401 for unauthorized
  }

  // Checking Admin Login
  if (user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Access denied. Only admins can log in." });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: (process.env.NODE_ENV = "production"),
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
  });

  const userData = {
    name: user.name,
    email: user.email,
  };
  res.status(200).json({ message: "Login successfull", data: userData });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const allUsers = await User.find();

    if (allUsers.length == 0) {
      return res.status(404).json({ message: "No Users Found" });
    }

    return res
      .status(200)
      .json({ message: "All Users found for Admin", data: allUsers });
  } catch (error) {
    console.log(error, "My Error");
  }
});
