import InvestmentTimeline from "../../models/portfolio/investmentTimeline.js";
import { uploadFileToCloudinary } from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createInvestmentTimeline = asyncHandler(async (req, res) => {
  const { image } = req.files;
  const uploadedImage = image ? await uploadFileToCloudinary(image) : null;

  // Create a new InvestmentTimeline entry
  const newInvestmentTimeline = await InvestmentTimeline.create({
    ...req.body,
    image: uploadedImage ? uploadedImage[0] : null,
  });
  console.log("sdf", newInvestmentTimeline);
  if (!newInvestmentTimeline) {
    return next(
      new ApiErrorResponse("Investment Timeline creation failed", 400)
    );
  }

  return res.status(201).json({
    success: true,
    message: "Investment Timeline created successfully",
    data: newInvestmentTimeline,
  });
});
