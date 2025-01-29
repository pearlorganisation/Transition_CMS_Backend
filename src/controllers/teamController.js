import mongoose from "mongoose";
import Team from "../models/team.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { paginate } from "../utils/pagination.js";

export const getAllTeams = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  // Use the pagination utility function
  const { data: teams, pagination } = await paginate(
    Team, // Model
    page, // Current page
    limit // Limit per page
    // [], // No population needed
    // {}, // No filters
    // "" // No fields to exclude or select
  );

  // Check if no obituaries are found
  if (!teams || teams.length === 0) {
    return next(new ApiErrorResponse("No Teams found", 404));
  }

  // Return the paginated response
  return res.status(200).json({
    success: true,
    message: "All teams found successfully",
    pagination, // Include pagination metadata
    data: teams,
  });
});

export const getSingleTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return next(new ApiErrorResponse("team not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "team found successfully",
    data: team,
  });
});

export const deleteTeam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const team = await Team.findByIdAndDelete(id);
  if (!team) {
    return next(new ApiErrorResponse("team not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "team deleted successfully",
  });
});

// export const updateTeam = asyncHandler(async (req, res, next) => {
//   const { id } = req.params; // Get the team ID from params
//   const { image } = req.files || {}; // Extract image file if provided

//   // Find the existing team
//   const team = await Team.findById(id);

//   // Handle case where the team doesn't exist
//   if (!team) {
//     return next(new ApiErrorResponse("Team not found", 404));
//   }

//   let uploadedImage = null;

//   // If a new image is provided, upload it and delete the old one
//   if (image) {
//     // Upload the new image to Cloudinary
//     uploadedImage = await uploadFileToCloudinary(image);

//     // Delete the old image from Cloudinary if it exists
//     if (team.image && team.image.public_id) {
//       await deleteFileFromCloudinary(team.image.public_id);
//     }
//   }

//   // Update the team with new data and image
//   const updatedTeam = await Team.findByIdAndUpdate(
//     id,
//     {
//       ...req.body,
//       image: uploadedImage ? uploadedImage[0] : team.image, // Use new image or keep old one
//     },
//     { new: true, runValidators: true }
//   );

//   // Handle update failure
//   if (!updatedTeam) {
//     return next(new ApiErrorResponse("Team update failed", 400));
//   }

//   // Return successful response
//   return res.status(200).json({
//     success: true,
//     message: "Team updated successfully",
//     data: updatedTeam,
//   });
// });

export const createTeam = asyncHandler(async (req, res, next) => {
  const { image } = req.files;

  // Upload main image to Cloudinary if it exists
  const uploadedImage = image ? await uploadFileToCloudinary(image) : null;

  // Create obituary record with uploaded images
  const teamInfo = await Team.create({
    ...req.body,
    image: uploadedImage[0],
  });

  // Handle creation failure
  if (!teamInfo) {
    return next(new ApiErrorResponse("Team creation failed", 400));
  }

  // Return successful response
  return res.status(201).json({
    success: true,
    message: "Team created successfully",
    data: teamInfo,
  });
});

export const updateTeam = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { image } = req.files || {};

  // Find the existing team by ID
  const team = await Team.findById(id);

  // Handle case where team does not exist
  if (!team) {
    return next(new ApiErrorResponse("Team not found", 404));
  }

  // Upload new image to Cloudinary if provided
  let updatedImage = team.image; // Retain the old image by default
  if (image) {
    updatedImage = await uploadFileToCloudinary(image);
  }

  console.log(updatedImage, "Updated Image");
  console.log(req.body, "Req Body");
  // Update team fields
  const updatedTeam = await Team.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(`${id}`) },

    {
      ...req.body,
      image: updatedImage[0],
    },
    { new: true } // Return the updated document and validate fields
  );

  //   console.log("Updated Team 1234: ", updatedTeam);

  // Handle update failure
  if (!updatedTeam) {
    return next(new ApiErrorResponse("Team update failed", 400));
  }

  // Return successful response
  return res.status(200).json({
    success: true,
    message: "Team updated successfully1234",
    data: updatedTeam,
  });
});
