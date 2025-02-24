import { ImpactModel } from "../models/impactModel.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";

// @desc    Create Impact Data
// @route   POST /api/impact
// @access  Public or Protected (if needed)
export const createImpact = asyncHandler(async (req, res, next) => {
  const { title, impactDataType } = req.body;
  const { icon } = req.files;
  const uploadedIcon = icon ? await uploadFileToCloudinary(icon) : null;
  if (!title || !impactDataType) {
    return res
      .status(400)
      .json({
        status: true,
        message: "Title and ImpactDataType is required fields.",
      });
  }

  const payload = {
    ...req.body,
  };

  if (uploadedIcon) {
    payload.icon = uploadedIcon?.[0];
  }
  console.log("payload", payload);
  const newImpact = await ImpactModel.create({ ...payload });
  res
    .status(201)
    .json({
      status: true,
      data: newImpact,
      message: "Impact Data Created Successfully!!",
    });
});

// @desc    Get All Impact Data
// @route   GET /api/impact
// @access  Public
export const getAllImpact = asyncHandler(async (req, res, next) => {
  const impacts = await ImpactModel.find();
  res
    .status(200)
    .json({
      status: true,
      data: impacts,
      message: "Data Fetched Successfully !!",
    });
});

// @desc    Get Impact Data by ID
// @route   GET /api/impact/:id
// @access  Public
export const getImpactById = asyncHandler(async (req, res, next) => {
  const impact = await ImpactModel.findById(req.params.id);
  if (!impact) {
    return next(new ApiErrorResponse("Data not found", 404));
  }
  res
    .status(200)
    .json({
      status: true,
      data: impact,
      message: "Data Fetched Successfully !!",
    });
});

// @desc    Update Impact Data
// @route   PUT /api/impact/:id
// @access  Protected (if needed)
export const updateImpact = asyncHandler(async (req, res, next) => {
  console.log("first", req);
  const { icon } = req.files;
  const uploadedIcon = icon ? await uploadFileToCloudinary(icon) : null;
  console.log("the uploaded icon is", uploadedIcon?.[0]);
  const payload = {
    ...req.body,
  };
  console.log("the payload after spreading is", payload);
  if (uploadedIcon) {
    payload.icon = uploadedIcon?.[0];
  }

  const updatedImpactData = await ImpactModel.findOneAndUpdate(
    { _id: req.params.id },
    { ...payload },
    {
      new: true,
      runValidators: false,
    }
  );

  if (!updatedImpactData) {
    return next(new ApiErrorResponse("Impact data not found", 404));
  }

  res.status(200).json({
    success: true,
    data: updatedImpactData,
  });
});

// @desc    Delete Impact Data
// @route   DELETE /api/impact/:id
// @access  Protected (if needed)
export const deleteImpact = asyncHandler(async (req, res, next) => {
  const deletedImpact = await ImpactModel.findByIdAndDelete(req.params.id);

  if (!deletedImpact) {
    return next(new ApiErrorResponse("Impact data not found", 404));
  }

  res
    .status(200)
    .json({ success: true, message: "Impact data deleted successfully" });
});
