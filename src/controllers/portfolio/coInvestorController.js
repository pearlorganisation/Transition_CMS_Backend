import CoInvestor from "../../models/portfolio/coInvestor.js";
import { uploadFileToCloudinary } from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createCoInvestor = asyncHandler(async (req, res, next) => {
  const { logo } = req.files;
  const uploadedLogo = logo ? await uploadFileToCloudinary(logo) : null;

  const coInvestorInfo = await CoInvestor.create({
    name: req.body.name,
    logo: uploadedLogo ? uploadedLogo[0] : null,
  });

  if (!coInvestorInfo) {
    return next(new ApiErrorResponse("Co-Investor creation failed", 400));
  }

  return res.status(201).json({
    success: true,
    message: "Co-Investor created successfully",
    data: coInvestorInfo,
  });
});

export const getAllCoInvestor = asyncHandler(async (req, res, next) => {
  const coInvestorInfo = await CoInvestor.find();
  if (!coInvestorInfo) {
    return next(new ApiErrorResponse("Co-Investor not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Co-Investor retrieved successfully",
    data: coInvestorInfo,
  });
});
