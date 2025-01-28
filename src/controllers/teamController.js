import Team from "../models/team.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryConfig.js";
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

export const updateTeam = asyncHandler(async (req, res, next) => {});

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
    return next(new ApiErrorResponse("Obituary creation failed", 400));
  }

  // Return successful response
  return res.status(201).json({
    success: true,
    message: "Team created successfully",
    data: teamInfo,
  });
});
