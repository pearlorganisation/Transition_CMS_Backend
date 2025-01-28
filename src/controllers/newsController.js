import News from "../models/news.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import { paginate } from "../utils/pagination.js";

export const getAllNews = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "10");

  // Use the pagination utility function
  const { data: news, pagination } = await paginate(
    News, // Model
    page, // Current page
    limit // Limit per page
    // [], // No population needed
    // {}, // No filters
    // "" // No fields to exclude or select
  );

  // Check if no obituaries are found
  if (!news || news.length === 0) {
    return next(new ApiErrorResponse("No news found", 404));
  }

  // Return the paginated response
  return res.status(200).json({
    success: true,
    message: "All news found successfully",
    pagination, // Include pagination metadata
    data: news,
  });
});

export const getSingleNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(new ApiErrorResponse("news not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "news found successfully",
    data: news,
  });
});

export const deleteNews = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const news = await News.findByIdAndDelete(id);
  if (!news) {
    return next(new ApiErrorResponse("news with id not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: "news deleted successfully",
  });
});

export const updateNews = asyncHandler(async (req, res, next) => {});

export const createNews = asyncHandler(async (req, res, next) => {
  const { image } = req.files;

  // Upload main image to Cloudinary if it exists
  const uploadedImage = image ? await uploadFileToCloudinary(image) : null;

  // Create obituary record with uploaded images
  const newsInfo = await News.create({
    ...req.body,
    image: uploadedImage[0],
  });

  // Handle creation failure
  if (!newsInfo) {
    return next(new ApiErrorResponse("News creation failed", 400));
  }

  // Return successful response
  return res.status(201).json({
    success: true,
    message: "News created successfully",
    data: newsInfo,
  });
});
