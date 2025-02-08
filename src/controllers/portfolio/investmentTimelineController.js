import InvestmentTimeline from "../../models/portfolio/investmentTimeline.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

export const createInvestmentTimeline = asyncHandler(async (req, res) => {
  const { image } = req.files;
  const uploadedImage = image ? await uploadFileToCloudinary(image) : null;

  // Create a new InvestmentTimeline entry
  const newInvestmentTimeline = await InvestmentTimeline.create({
    ...req.body,
    image: uploadedImage ? uploadedImage[0] : null,
  });

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

export const getInvestmentTimelineById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const investmentTimeline = await InvestmentTimeline.findById(id).populate(
      "cards"
    );
    if (!investmentTimeline) {
      return next(new ApiErrorResponse("Investment Timeline not found", 404));
    }
    return res.status(200).json({
      success: true,
      message: "Investment Timeline retrieved successfully",
      data: investmentTimeline,
    });
  }
);

export const getAllInvestmentTimelines = asyncHandler(
  async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { data: investmentTimelines, pagination } = await paginate(
      InvestmentTimeline,
      page,
      limit,
      [{ path: "cards" }]
    );

    if (!investmentTimelines) {
      return next(new ApiErrorResponse("Investment Timelines not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Investment Timelines retrieved successfully",
      pagination,
      data: investmentTimelines,
    });
  }
);

export const updateInvestmentTimelineById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const investmentTimeline = await InvestmentTimeline.findById(id);
    if (!investmentTimeline) {
      return next(new ApiErrorResponse("Investment Timeline not found", 404));
    }

    const { image } = req.files;
    const uploadedImage = image
      ? await uploadFileToCloudinary(image)
      : undefined;

    if (uploadedImage?.[0] && investmentTimeline?.image) {
      await deleteFileFromCloudinary(investmentTimeline.image);
    }

    const updatedInvestmentTimeline =
      await InvestmentTimeline.findByIdAndUpdate(
        id,
        {
          ...req.body,
          image: uploadedImage ? uploadedImage[0] : undefined,
        },
        { new: true, runValidators: true }
      ).populate("cards");

    if (!updatedInvestmentTimeline) {
      return next(new ApiErrorResponse("Investment Timeline not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Investment Timeline updated successfully",
      data: updatedInvestmentTimeline,
    });
  }
);

export const deleteInvestmentTimelineById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const investmentTimeline = await InvestmentTimeline.findByIdAndDelete(id);
    if (!investmentTimeline) {
      return next(new ApiErrorResponse("Investment Timeline not found", 404));
    }
    if (investmentTimeline.image) {
      await deleteFileFromCloudinary(investmentTimeline.image);
    }
    return res.status(200).json({
      success: true,
      message: "Investment Timeline deleted successfully",
    });
  }
);
