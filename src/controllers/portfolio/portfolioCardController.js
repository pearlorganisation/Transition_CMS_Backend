import PortfolioCard from "../../models/portfolio/portfolioCard.js";
import { uploadFileToCloudinary } from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

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
