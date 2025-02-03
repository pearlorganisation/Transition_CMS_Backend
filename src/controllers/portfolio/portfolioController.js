import Portfolio from "../../models/portfolio/portfolio.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createPortfolio = asyncHandler(async (req, res, next) => {
  const { logo, bottomSectionIcon, bg } = req.files || {};

  // Upload images to Cloudinary if they exist
  const uploadedLogo = logo ? await uploadFileToCloudinary(logo) : null;
  const uploadedBg = bg ? await uploadFileToCloudinary(bg) : null;

  const uploadedBottomSectionIcon = bottomSectionIcon
    ? await uploadFileToCloudinary(bottomSectionIcon)
    : null;

  // Create portfolio record with uploaded images
  const portfolio = await Portfolio.create({
    ...req.body,
    logo: uploadedLogo ? uploadedLogo[0] : null,
    bg: uploadedBg ? uploadedBg[0] : null,
    bottomSectionIcon: uploadedBottomSectionIcon
      ? uploadedBottomSectionIcon[0]
      : null,
  });

  // Handle creation failure
  if (!portfolio) {
    return next(new ApiErrorResponse("Portfolio creation failed", 400));
  }

  // Return successful response
  return res.status(201).json({
    success: true,
    message: "Portfolio created successfully",
    data: portfolio,
  });
});

export const getPortfolioById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const portfolio = await Portfolio.findById(id)
    .populate({
      path: "investmentTimeline",
      populate: {
        path: "cards",
      },
    })
    .populate({
      path: "cards",
    })
    .populate({
      path: "coInvestedBy",
    });

  if (!portfolio) {
    return next(new ApiErrorResponse("Portfolio not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Portfolio retrieved successfully",
    data: portfolio,
  });
});

export const getAllPortfolios = asyncHandler(async (req, res, next) => {
  // Fetch all portfolios and populate the necessary fields
  const portfolios = await Portfolio.find()
    .populate({
      path: "investmentTimeline",
      populate: {
        path: "cards",
      },
    })
    .populate({
      path: "cards",
    })
    .populate({
      path: "coInvestedBy",
    });

  if (!portfolios || portfolios.length === 0) {
    return next(new ApiErrorResponse("No portfolios found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Portfolios retrieved successfully",
    data: portfolios,
  });
});

export const updatePortfolioById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const portfolio = await Portfolio.findById(id);
  if (!portfolio) {
    return next(new ApiErrorResponse("Portfolio not found", 404));
  }

  const { logo, bg, bottomSectionIcon } = req.files || {};

  const uploadedLogo = logo ? await uploadFileToCloudinary(logo) : undefined;
  const uploadedBg = bg ? await uploadFileToCloudinary(bg) : undefined;
  const uploadedBottomSectionIcon = bottomSectionIcon
    ? await uploadFileToCloudinary(bottomSectionIcon)
    : undefined;

  if (uploadedLogo) {
    if (portfolio.logo) {
      await deleteFileFromCloudinary(portfolio.logo);
    }
  }
  if (uploadedBg) {
    if (portfolio.bg) {
      await deleteFileFromCloudinary(portfolio.bg);
    }
  }
  if (uploadedBottomSectionIcon) {
    if (portfolio.bottomSectionIcon) {
      await deleteFileFromCloudinary(portfolio.bottomSectionIcon);
    }
  }
  const updatedPortfolio = await Portfolio.findByIdAndUpdate(
    id,
    {
      ...req.body,
      logo: uploadedLogo ? uploadedLogo[0] : undefined,
      bg: uploadedBg ? uploadedBg[0] : undefined,
      bottomSectionIcon: uploadedBottomSectionIcon
        ? uploadedBottomSectionIcon[0]
        : undefined,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedPortfolio) {
    return next(new ApiErrorResponse("Portfolio not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Portfolio updated successfully",
    data: updatedPortfolio,
  });
});

export const deletePortfolioById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const portfolio = await Portfolio.findByIdAndDelete(id);
  if (!portfolio) {
    return next(new ApiErrorResponse("Portfolio not found", 404));
  }
  if (portfolio.logo) {
    await deleteFileFromCloudinary(portfolio.logo);
  }
  if (portfolio.bg) {
    await deleteFileFromCloudinary(portfolio.bg);
  }
  if (portfolio.bottomSectionIcon) {
    await deleteFileFromCloudinary(portfolio.bottomSectionIcon);
  }
  return res.status(200).json({
    success: true,
    message: "Portfolio deleted successfully",
  });
});
