import InvestmentTimelineCard from "../../models/portfolio/investmentTimelineCard.js";
import { uploadFileToCloudinary } from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createInvestmentTimelineCard = asyncHandler(
  async (req, res, next) => {
    const { icon } = req.files;

    // Upload icon image to Cloudinary if it exists
    const uploadedIcon = icon ? await uploadFileToCloudinary(icon) : null;

    // Create investment timeline card with uploaded icon
    const investmentTimelineCard = await InvestmentTimelineCard.create({
      title: req.body.title,
      body: req.body.body,
      icon: uploadedIcon ? uploadedIcon[0] : null,
    });

    // Handle creation failure
    if (!investmentTimelineCard) {
      return next(
        new ApiErrorResponse("Investment Timeline Card creation failed", 400)
      );
    }

    // Return successful response
    return res.status(201).json({
      success: true,
      message: "Investment Timeline Card created successfully",
      data: investmentTimelineCard,
    });
  }
);
