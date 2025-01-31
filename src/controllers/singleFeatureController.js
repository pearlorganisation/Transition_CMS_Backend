import mongoose from "mongoose";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { paginate } from "../utils/pagination.js";
import SingleFeature from "../models/singleFeature.js";

export const getAllFocusFeatures = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  // Use the pagination utility function
  const { data: focusFeatures, pagination } = await paginate(
    SingleFeature, // Model
    page, // Current page
    limit // Limit per page
    // [], // No population needed
    // {}, // No filters
    // "" // No fields to exclude or select
  );

  if (!focusFeatures || focusFeatures.length === 0) {
    return next(new ApiErrorResponse("No Focus Features found", 404));
  }

  // Return the paginated response
  return res.status(200).json({
    success: true,
    message: "All Focus Features found successfully",
    pagination,
    data: focusFeatures,
  });
});

export const getSingleFocusFeature = asyncHandler(async (req, res, next) => {
  const focusFeature = await SingleFeature.findById(req.params.id);

  if (!focusFeature) {
    return next(new ApiErrorResponse("focusFeature not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "focusFeature found successfully",
    data: focusFeature,
  });
});

export const deleteFocusFeature = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const focusFeature = await SingleFeature.findByIdAndDelete(id);
  if (!focusFeature) {
    return next(new ApiErrorResponse("focus Feature not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "focus Feature deleted successfully",
  });
});

export const createFocusFeature = asyncHandler(async (req, res, next) => {
  const { image } = req.files;

  // Upload main image to Cloudinary if it exists
  const uploadedImage = image ? await uploadFileToCloudinary(image) : null;

  // Create obituary record with uploaded images
  const focusFeatureInfo = await SingleFeature.create({
    ...req.body,
    image: uploadedImage[0],
  });

  // Handle creation failure
  if (!focusFeatureInfo) {
    return next(new ApiErrorResponse("focusFeature creation failed", 400));
  }

  // Return successful response
  return res.status(201).json({
    success: true,
    message: "focusFeature created successfully",
    data: focusFeatureInfo,
  });
});

export const updateFocusFeature = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { image } = req.files || {};

  const focusFeature = await SingleFeature.findById(id);

  if (!focusFeature) {
    return next(new ApiErrorResponse("focusFeature not found", 404));
  }

  let updatedImage = focusFeature.image;
  if (image) {
    updatedImage = await uploadFileToCloudinary(image);
  }

  const updatedFocusFeature = await SingleFeature.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(`${id}`) },

    {
      ...req.body,
      image: updatedImage[0],
    },
    { new: true }
  );

  if (!updatedFocusFeature) {
    return next(new ApiErrorResponse("Focus Feature update failed", 400));
  }

  return res.status(200).json({
    success: true,
    message: "Focus Feature updated successfully",
    data: updatedFocusFeature,
  });
});
