import InvestmentTimelineCard from "../../models/portfolio/investmentTimelineCard.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../utils/cloudinaryConfig.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import { paginate } from "../../utils/pagination.js";

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

export const getInvestmentTimelineCardById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const investmentTimelineCard = await InvestmentTimelineCard.findById(id);
    if (!investmentTimelineCard) {
      return next(
        new ApiErrorResponse("Investment Timeline Card not found", 404)
      );
    }

    return res.status(200).json({
      success: true,
      message: "Investment Timeline Card retrieved successfully",
      data: investmentTimelineCard,
    });
  }
);

export const getAllInvestmentTimelineCards = asyncHandler(
  async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { data: investmentTimelineCards, pagination } = await paginate(
      InvestmentTimelineCard,
      page,
      limit
    );

    if (!investmentTimelineCards) {
      return next(
        new ApiErrorResponse("Investment Timeline Cards not found", 404)
      );
    }

    return res.status(200).json({
      success: true,
      message: "Investment Timeline Cards retrieved successfully",
      pagination,
      data: investmentTimelineCards,
    });
  }
);

export const updateInvestmentTimelineCardById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const investmentTimelineCard = await InvestmentTimelineCard.findById(id);
    if (!investmentTimelineCard) {
      return next(
        new ApiErrorResponse("Investment Timeline Card not found", 404)
      );
    }

    const { icon } = req.files;
    const uploadedIcon = icon ? await uploadFileToCloudinary(icon) : undefined;

    if (uploadedIcon?.[0] && investmentTimelineCard?.icon) {
      await deleteFileFromCloudinary(investmentTimelineCard.icon);
    }

    const updatedInvestmentTimelineCard =
      await InvestmentTimelineCard.findByIdAndUpdate(
        id,
        {
          ...req.body,
          icon: uploadedIcon ? uploadedIcon[0] : undefined,
        },
        { new: true, runValidators: true }
      );

    if (!updatedInvestmentTimelineCard) {
      return next(
        new ApiErrorResponse("Investment Timeline Card not found", 404)
      );
    }

    return res.status(200).json({
      success: true,
      message: "Investment Timeline Card updated successfully",
      data: updatedInvestmentTimelineCard,
    });
  }
);

export const deleteInvestmentTimelineCardById = asyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const investmentTimelineCard =
      await InvestmentTimelineCard.findByIdAndDelete(id);
    if (!investmentTimelineCard) {
      return next(
        new ApiErrorResponse("Investment Timeline Card not found", 404)
      );
    }
    if (investmentTimelineCard.icon) {
      await deleteFileFromCloudinary(investmentTimelineCard.icon);
    }
    return res.status(200).json({
      success: true,
      message: "Investment Timeline Card deleted successfully",
    });
  }
);
