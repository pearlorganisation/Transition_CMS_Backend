import mongoose from "mongoose";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { paginate } from "../utils/pagination.js";
import FocusArea from "../models/focusArea.js";
import path from "path";

export const getFocusAreas = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  // Use the pagination utility function
  //   const { data: focusAreas, pagination } = await paginate(
  //     FocusArea, // Model
  //     page, // Current page
  //     limit,
  //     [
  //       // Limit per page
  //       // [], // No population needed
  //       { path: "focusAreas" },
  //     ] // No filters
  //     // {}, // No filters
  //     // "" // No fields to exclude or select
  //   );

  // Check if no obituaries are found
  const focusAreas = await FocusArea.find().populate("focusAreas._id");
  if (!focusAreas || focusAreas.length === 0) {
    return next(new ApiErrorResponse("No Focus Areas found", 404));
  }

  // Return the paginated response
  return res.status(200).json({
    success: true,
    message: "All focus areas found successfully",
    // pagination, // Include pagination metadata
    data: focusAreas,
  });
});

export const getSinlgeFocusArea = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const focusArea = await FocusArea.findById(id).populate("focusAreas._id");
  if (!focusArea) {
    return next(new ApiErrorResponse("focusArea not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Focus Area fetched successfully",
    data: focusArea,
  });
});

export const deleteFocusArea = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const focusArea = await FocusArea.findByIdAndDelete(id);
  if (!focusArea) {
    return next(new ApiErrorResponse("focusArea not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "Focus Area deleted successfully",
  });
});

export const createFocusArea = asyncHandler(async (req, res, next) => {
  const focusAreaInfo = await FocusArea.create({
    ...req.body,
  });

  if (!focusAreaInfo) {
    return next(new ApiErrorResponse("focusArea creation failed", 400));
  }

  // Return successful response
  return res.status(201).json({
    success: true,
    message: "Focus Area created successfully",
    data: focusAreaInfo,
  });
});

export const updateFocusArea = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const focusArea = await FocusArea.findById(id);

  if (!focusArea) {
    return next(new ApiErrorResponse("Focus Area not found", 404));
  }

  const updatedFocusArea = await FocusArea.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(`${id}`) },

    {
      ...req.body,
    },
    { new: true }
  );

  if (!updatedFocusArea) {
    return next(new ApiErrorResponse("Focus Area update failed", 400));
  }

  return res.status(200).json({
    success: true,
    message: "Focus Area updated successfully",
    data: updatedFocusArea,
  });
});
