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
  // Shift orders of remaining blogs
  await SingleFeature.updateMany(
    {
      order: { $gt: focusFeature.order },
    }, // Find blogs with higher order
    { $inc: { order: -1 } } // Decrease order by 1
  );
  if (focusFeature.image) {
    await deleteFileFromCloudinary(focusFeature.image);
  }
  return res.status(200).json({
    success: true,
    message: "focus Feature deleted successfully",
  });
});

export const createFocusFeature = asyncHandler(async (req, res, next) => {
  const { image } = req.files;
  const { order } = req.body;

  // Ensure order is a positive integer (not 0 or negative)
  if (order !== undefined && (isNaN(order) || order < 1)) {
    return next(
      new ApiErrorResponse(
        "Order must be a positive number greater than 0",
        400
      )
    );
  }

  const totalDocuments = await SingleFeature.countDocuments();

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

  // Shift existing blogs' order if a specific order is provided
  if (order) {
    await SingleFeature.updateMany(
      {
        order: { $gte: order },
      },
      { $inc: { order: 1 } }
    );
  }

  // Create obituary record with uploaded images
  const focusFeatureInfo = await SingleFeature.create({
    ...req.body,
    order: order || totalDocuments + 1,
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

// export const updateFocusFeature = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { image } = req.files || {};

//   const focusFeature = await SingleFeature.findById(id);

//   if (!focusFeature) {
//     return next(new ApiErrorResponse("focusFeature not found", 404));
//   }

//   let updatedImage = focusFeature.image;
//   if (image) {
//     updatedImage = await uploadFileToCloudinary(image);
//   }

//   const updatedFocusFeature = await SingleFeature.findOneAndUpdate(
//     { _id: new mongoose.Types.ObjectId(`${id}`) },

//     {
//       ...req.body,
//       image: updatedImage[0],
//     },
//     { new: true }
//   );

//   if (!updatedFocusFeature) {
//     return next(new ApiErrorResponse("Focus Feature update failed", 400));
//   }

//   return res.status(200).json({
//     success: true,
//     message: "Focus Feature updated successfully",
//     data: updatedFocusFeature,
//   });
// });

export const updateFocusFeature = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, features, order } = req.body;
  const { image } = req.files || {};

  const focusFeature = await SingleFeature.findById(id);

  if (!focusFeature) {
    return next(new ApiErrorResponse("Focus Feature not found", 404));
  }
  const totalDocuments = await SingleFeature.countDocuments();

  // Ensure order is a positive integer (not 0 or negative) and within valid range
  if (
    order !== undefined &&
    (isNaN(order) || order < 1 || order > totalDocuments)
  ) {
    return next(
      new ApiErrorResponse(
        `Order must be between 1 and ${totalDocuments}(including 1 and ${totalDocuments})`,
        400
      )
    );
  }

  // Handling image update
  if (image) {
    await deleteFileFromCloudinary(focusFeature.image); // Delete previous image
    const uploadedImage = await uploadFileToCloudinary(image);
    focusFeature.image = uploadedImage?.[0] || focusFeature.image;
  }

  // Updating fields if provided
  if (title) focusFeature.title = title;
  if (features) focusFeature.features = features;

  // Handling order update correctly
  if (order && order !== focusFeature.order) {
    const oldOrder = focusFeature.order;

    if (order > oldOrder) {
      // Moving down: Decrease order of items in between
      await SingleFeature.updateMany(
        { order: { $gt: oldOrder, $lte: order } },
        { $inc: { order: -1 } }
      );
    } else {
      // Moving up: Increase order of items in between
      await SingleFeature.updateMany(
        { order: { $gte: order, $lt: oldOrder } },
        { $inc: { order: 1 } }
      );
    }

    focusFeature.order = order;
  }

  await focusFeature.save({ runValidators: true });

  return res.status(200).json({
    success: true,
    message: "Focus Feature updated successfully",
    data: focusFeature,
  });
});
