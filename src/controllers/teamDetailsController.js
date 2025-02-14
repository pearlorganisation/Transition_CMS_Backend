import mongoose from "mongoose";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import TeamDetails from "../models/teamDetails.js";

export const getAllTeamDetails = asyncHandler(async (req, res, next) => {
  const teamDetails = await TeamDetails.find();
  // Check if no obituaries are found
  if (!teamDetails || teamDetails.length === 0) {
    return next(new ApiErrorResponse("No Team Details found", 404));
  }

  // Return the paginated response
  return res.status(200).json({
    success: true,
    message: "All team details found successfully",
    // pagination, // Include pagination metadata
    length: teamDetails.length,
    data: teamDetails,
  });
});

export const deleteTeamDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const team = await TeamDetails.findByIdAndDelete(id);
  if (!team) {
    return next(new ApiErrorResponse("team details not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "team detail deleted successfully",
  });
});

export const createTeamDetails = asyncHandler(async (req, res, next) => {
  const { image } = req.files;

  // Upload main image to Cloudinary if it exists
  const uploadedImage = image ? await uploadFileToCloudinary(image) : null;

  // Create obituary record with uploaded images
  const teamInfo = await TeamDetails.create({
    ...req.body,
    image: uploadedImage[0],
  });

  // Handle creation failure
  if (!teamInfo) {
    return next(new ApiErrorResponse("Team Details creation failed", 400));
  }

  // Return successful response
  return res.status(201).json({
    success: true,
    message: "Team Details created successfully",
    data: teamInfo,
  });
});

export const updateTeamDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { image } = req.files || {};

  // Find the existing team by ID
  const team = await TeamDetails.findById(id);

  // Handle case where team does not exist
  if (!team) {
    return next(new ApiErrorResponse("Team Details not found", 404));
  }

  // Upload new image to Cloudinary if provided
  let updatedImage = team.image; // Retain the old image by default
  if (image) {
    updatedImage = await uploadFileToCloudinary(image);
  }

  console.log(updatedImage, "Updated Image");
  console.log(req.body, "Req Body");
  // Update team fields
  const updatedTeam = await TeamDetails.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(`${id}`) },

    {
      ...req.body,
      image: updatedImage[0],
    },
    { new: true } // Return the updated document and validate fields
  );

  // Handle update failure
  if (!updatedTeam) {
    return next(new ApiErrorResponse("Team details update failed", 400));
  }

  return res.status(200).json({
    success: true,
    message: "Team details updated successfully1234",
    data: updatedTeam,
  });
});

export const getSingleTeamDetails = asyncHandler(async (req, res, next) => {
  const team = await TeamDetails.findById(req.params.id);

  if (!team) {
    return next(new ApiErrorResponse("team detail with ID not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "team details with ID found successfully",
    data: team,
  });
});
