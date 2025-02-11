import Page from "../../models/page/page.js";
import ApiErrorResponse from "../../utils/errors/ApiErrorResponse.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";

export const createPage = asyncHandler(async (req, res, next) => {
  const { pageName, mainTitle, body, cards } = req.body;
  console.log("req: ", req);
  let updatedCards = [];
  try {
    //     // Check if a page with the same name already exists
    //     const existingPage = await Page.findOne({ pageName });
    //     if (existingPage) {
    //       return next(
    //         new ApiErrorResponse("Page with this name already exists", 400)
    //       );
    //     }

    //     // Create a new page
    //     const newPage = await Page.create({
    //       pageName,
    //       mainTitle,
    //       body,
    //       cards,
    //     });

    // Return successful response
    res.status(201).json({
      success: true,
      message: "Page created successfully",
      data: req.body,
    });
  } catch (error) {
    next(new ApiErrorResponse(error.message, 500));
  }
});
