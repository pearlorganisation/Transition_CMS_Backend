import User from "../models/user.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import jwt from "jsonwebtoken";

export const getUserProfile = asyncHandler(async (req, res) => {
  console.log("Cookies received:", req.cookies);

  const token =
    req.cookies?.authToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  console.log("Extracted Token:", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      message: "User profile fetched successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // Add more profile fields if necessary
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid or expired token!" });
  }
});

export const updateUserDetails = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  if (!email) {
    return next(new ApiErrorResponse("Unauthorized User", 401));
  }
  console.log(email);
  // Fetch the existing user details
  let user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    return next(new ApiErrorResponse("User not found", 404));
  }

  // Update user details
  user.name = req.body.name || user.name;

  if (req.body.password) {
    user.password = req.body.password; // This triggers pre("save") for hashing
  }

  await user.save(); // Save to trigger middleware

  user.password = undefined;
  return res.status(200).json({
    success: true,
    message: "User details updated successfully!",
    user,
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;
  if (!email) {
    return next(new ApiErrorResponse("Email is required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) return next(new ApiErrorResponse("No user found!!", 400));

  existingUser.password = newPassword;
  await existingUser.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
});
