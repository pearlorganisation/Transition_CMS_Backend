import CoInvestor from "../models/coInvestor.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";

export const createCoInvestor = asyncHandler(async (req, res, next) => {
  const { logo } = req.files;

  // Upload logo image to Cloudinary if it exists
  const uploadedLogo = logo ? await uploadFileToCloudinary(logo) : null;
  console.log(uploadedLogo);
  // Create co-investor record with uploaded logo
  const coInvestorInfo = await CoInvestor.create({
    name: req.body.name,
    logo: uploadedLogo ? uploadedLogo[0] : null,
  });

  // Handle creation failure
  if (!coInvestorInfo) {
    return next(new ApiErrorResponse("Co-Investor creation failed", 400));
  }

  // Return successful response
  return res.status(201).json({
    success: true,
    message: "Co-Investor created successfully",
    data: coInvestorInfo,
  });
});
