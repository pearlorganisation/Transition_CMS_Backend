import Portfolio from "../../models/portfolio/portfolio.js";
import { uploadFileToCloudinary } from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createPortfolio = asyncHandler(async (req, res, next) => {
  const { logo, bottomSectionIcon } = req.files || {};

  // Upload images to Cloudinary if they exist
  const uploadedLogo = logo ? await uploadFileToCloudinary(logo) : null;
  const uploadedBottomSectionIcon = bottomSectionIcon
    ? await uploadFileToCloudinary(bottomSectionIcon)
    : null;

  // Create portfolio record with uploaded images
  const portfolio = await Portfolio.create({
    ...req.body,
    logo: uploadedLogo ? uploadedLogo[0] : null,
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
