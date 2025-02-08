import CoInvestor from "../../models/portfolio/coInvestor.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { data: coInvestorInfo, pagination } = await paginate(
    CoInvestor,
    page,
    limit
  );
  if (!coInvestorInfo) {
    return next(new ApiErrorResponse("Co-Investor not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Co-Investor retrieved successfully",
    pagination,
    data: coInvestorInfo,
  });
});

export const updateCoInvestorById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const coInvestor = await CoInvestor.findById(id);
  if (!coInvestor) {
    return next(new ApiErrorResponse("Co-Investor not found", 404));
  }
  const { logo } = req.files;
  const uploadedLogo = logo ? await uploadFileToCloudinary(logo) : undefined;

  if (uploadedLogo?.[0] && coInvestor.logo) {
    await deleteFileFromCloudinary(coInvestor.logo);
  }

  const updatedCoInvestor = await CoInvestor.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      logo: uploadedLogo ? uploadedLogo[0] : undefined,
    },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedCoInvestor) {
    return next(new ApiErrorResponse("Co-Investor not found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "Co-Investor updated successfully",
    data: updatedCoInvestor,
  });
});

export const deleteCoInvestorById = asyncHandler(async (req, res, next) => {
  const deletedCoInvestor = await CoInvestor.findByIdAndDelete(
    req.params.id
  ).lean();

  if (!deletedCoInvestor) {
    return next(new ApiErrorResponse("Co-Investor not found", 404));
  }

  if (deletedCoInvestor.logo) {
    await deleteFileFromCloudinary(deletedCoInvestor.logo);
  }
  return res.status(200).json({
    success: true,
    message: "Co-Investor deleted successfully",
  });
});
