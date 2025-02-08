import PortfolioCard from "../../models/portfolio/portfolioCard.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

export const createPortfolioCard = asyncHandler(async (req, res, next) => {
  const { icon } = req.files;

  // Upload icon image to Cloudinary if it exists
  const uploadedIcon = icon ? await uploadFileToCloudinary(icon) : null;

  // Create portfolio card with uploaded icon
  const portfolioCard = await PortfolioCard.create({
    title: req.body.title,
    description: req.body.description,
    icon: uploadedIcon ? uploadedIcon[0] : null,
  });

  // Handle creation failure
  if (!portfolioCard) {
    return next(new ApiErrorResponse("Portfolio Card creation failed", 400));
  }

  // Return successful response
  return res.status(201).json({
    success: true,
    message: "Portfolio Card created successfully",
    data: portfolioCard,
  });
});

export const getPortfolioCardById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const portfolioCard = await PortfolioCard.findById(id);
  if (!portfolioCard) {
    return next(new ApiErrorResponse("Portfolio Card not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Portfolio Card retrieved successfully",
    data: portfolioCard,
  });
});

export const getAllPortfolioCards = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { data: portfolioCards, pagination } = await paginate(
    PortfolioCard,
    page,
    limit
  );

  if (!portfolioCards) {
    return next(new ApiErrorResponse("Portfolio Cards not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Portfolio Cards retrieved successfully",
    pagination,
    data: portfolioCards,
  });
});

export const updatePortfolioCardById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const portfolioCard = await PortfolioCard.findById(id);
  if (!portfolioCard) {
    return next(new ApiErrorResponse("Portfolio Card not found", 404));
  }

  const { icon } = req.files;
  const uploadedIcon = icon ? await uploadFileToCloudinary(icon) : undefined;

  if (uploadedIcon?.[0] && portfolioCard?.icon) {
    await deleteFileFromCloudinary(portfolioCard.icon);
  }

  const updatedPortfolioCard = await PortfolioCard.findByIdAndUpdate(
    id,
    {
      ...req.body,
      icon: uploadedIcon ? uploadedIcon[0] : undefined,
    },
    { new: true, runValidators: true }
  );

  if (!updatedPortfolioCard) {
    return next(new ApiErrorResponse("Portfolio Card update failed", 400));
  }

  return res.status(200).json({
    success: true,
    message: "Portfolio Card updated successfully",
    data: updatedPortfolioCard,
  });
});

export const deletePortfolioCardById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const portfolioCard = await PortfolioCard.findByIdAndDelete(id);
  if (!portfolioCard) {
    return next(new ApiErrorResponse("Portfolio Card not found", 404));
  }
  if (portfolioCard.icon) {
    await deleteFileFromCloudinary(portfolioCard.icon);
  }
  return res.status(200).json({
    success: true,
    message: "Portfolio Card deleted successfully",
  });
});
