import mongoose from "mongoose";
import Team from "../models/team.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";

export const getAllTeams = asyncHandler(async (req, res, next) => {
  const teams = await Team.find().sort({order: 1});
  // Check if no obituaries are found
  if (!teams || teams.length === 0) {
    return next(new ApiErrorResponse("No Teams found", 404));
  }

  // Return the paginated response
  return res.status(200).json({
    success: true,
    message: "All teams found successfully",
    // pagination, // Include pagination metadata
    length: teams.length,
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
  // Shift orders of remaining blogs
  await Team.updateMany(
    {
      type: team.type,
      order: { $gt: team.order },
    }, // Find blogs with higher order
    { $inc: { order: -1 } } // Decrease order by 1
  );

  if (team.image) {
    await deleteFileFromCloudinary(team.image);
  }

  return res.status(200).json({
    success: true,
    message: "team deleted successfully",
  });
});

export const createTeam = asyncHandler(async (req, res, next) => {
  const { image } = req.files;
  const { order, type } = req.body;

  // Ensure order is a positive integer (not 0 or negative)
  if (order !== undefined && (isNaN(order) || order < 1)) {
    return next(
      new ApiErrorResponse(
        "Order must be a positive number greater than 0",
        400
      )
    );
  }

  const totalDocuments = await Team.countDocuments({ type });

  if (order && order > totalDocuments + 1) {
    return next(
      new ApiErrorResponse(
        `Invalid order. Order cannot be greater than ${totalDocuments + 1}`,
        400
      )
    );
  }
  // Upload main image to Cloudinary if it exists
  const uploadedImage = image ? await uploadFileToCloudinary(image) : null;

  // Shift existing teams' order if a specific order is provided
  if (order) {
    await Team.updateMany(
      {
        type,
        order: { $gte: order },
      },
      { $inc: { order: 1 } }
    );
  }

  // Create obituary record with uploaded images
  const teamInfo = await Team.create({
    ...req.body,
    order: order || totalDocuments + 1,
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
  const { name, bio, link, type, order } = req.body;
  const { image } = req.files || {};

  // Conditional validation: If 'order' is provided, 'type' must also be present
  if (order !== undefined && !type) {
    return next(
      new ApiErrorResponse("Type is required when providing an order", 400)
    );
  }

  // Find the existing team member by ID
  const teamMember = await Team.findById(id);
  if (!teamMember) {
    return next(new ApiErrorResponse("Team member not found", 404));
  }

  // Validate 'type' field
  const allowedTypes = ["executive_team", "general_partners", "experts"];
  if (type && !allowedTypes.includes(type)) {
    return next(new ApiErrorResponse("Invalid type value", 400));
  }

  // Get the total number of team members for the provided type
  const totalDocuments = await Team.countDocuments({ type });

  // Ensure order is valid
  if (
    order !== undefined &&
    (isNaN(order) || order < 1 || order > totalDocuments)
  ) {
    return next(
      new ApiErrorResponse(
        `Order must be between 1 and ${totalDocuments} (including 1 and ${totalDocuments})`,
        400
      )
    );
  }

  // Handling image update
  if (image) {
    await deleteFileFromCloudinary(teamMember.image); // Delete previous image
    const uploadedImage = await uploadFileToCloudinary(image);
    teamMember.image = uploadedImage?.[0] || teamMember.image;
  }

  // Update fields if provided
  if (name) teamMember.name = name;
  if (link) teamMember.link = link;
  if (bio) teamMember.bio = bio;
  if (type) teamMember.type = type;

  // Handle order update
  if (order && order !== teamMember.order) {
    const oldOrder = teamMember.order;

    if (order > oldOrder) {
      // Moving down: Decrease order of items in between
      await Team.updateMany(
        {
          type,
          order: { $gt: oldOrder, $lte: order },
        },
        { $inc: { order: -1 } }
      );
    } else {
      // Moving up: Increase order of items in between
      await Team.updateMany(
        {
          type,
          order: { $gte: order, $lt: oldOrder },
        },
        { $inc: { order: 1 } }
      );
    }

    teamMember.order = order;
  }

  await teamMember.save({ runValidators: true });

  return res.status(200).json({
    success: true,
    message: "Team member updated successfully",
    data: teamMember,
  });
});
