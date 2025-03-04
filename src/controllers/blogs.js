import { BlogModel } from "../models/blogs.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryConfig.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
import ApiErrorResponse from "../utils/errors/ApiErrorResponse.js";

// @access  Public
export const createBlog = asyncHandler(async (req, res, next) => {
  const { title, shortTitle, dateMetaData, link, blogType, blogBody, order } =
    req.body;
  const { icon } = req.files;

  // Ensure order is a positive integer (not 0 or negative)
  if (order !== undefined && (isNaN(order) || order < 1)) {
    return next(
      new ApiErrorResponse(
        "Order must be a positive number greater than 0",
        400
      )
    );
  }

  const totalDocuments = await BlogModel.countDocuments({ blogType });

  if (order && order > totalDocuments + 1) {
    return next(
      new ApiErrorResponse(
        `Invalid order. Order cannot be greater than ${totalDocuments + 1}`,
        400
      )
    );
  }

  const uploadedIcon = icon ? await uploadFileToCloudinary(icon) : null;
  if (!title || !icon) {
    res
      .status(400)
      .json({ status: true, message: "Title and icons are required fields." });
  }

  // Shift existing blogs' order if a specific order is provided
  if (order) {
    await BlogModel.updateMany(
      {
        blogType,
        order: { $gte: order },
      },
      { $inc: { order: 1 } }
    );
  }

  const blog = await BlogModel.create({
    title,
    shortTitle,
    dateMetaData,
    link,
    blogType,
    order: order || totalDocuments + 1, // Assign order if not provided
    icon: uploadedIcon ? uploadedIcon?.[0] : null,
    blogBody,
  });

  res.status(201).json({
    status: true,
    message: "Blog created successfully",
    blog,
  });
});

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = asyncHandler(async (req, res) => {
  const { articles, press, podcast } = req.query;

  const filter = {};

  if (articles) {
    filter.blogType = "ARTICLES";
  }
  if (press) {
    filter.blogType = "PRESS";
  }
  if (podcast) {
    filter.blogType = "PODCAST";
  }

  const blogs = await BlogModel.find({ ...filter }).sort({ order: 1 });
  res.status(200).json({
    status: true,
    message: "Data Fetched successfully",
    data: blogs,
  });
});

// @desc    Get a single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await BlogModel.findById(req.params.id);

  if (!blog) {
    res.status(404).json({ status: true, message: "Blog not found" });
  }

  res.status(200).json({
    status: true,
    message: "Data Fetched Successfully !!",
    data: blog,
  });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await BlogModel.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ status: false, message: "Blog Not Found" });
  }
  if (blog.icon) {
    await deleteFileFromCloudinary(blog.icon);
  }
  await blog.deleteOne();

  // Shift orders of remaining blogs
  await BlogModel.updateMany(
    {
      blogType: blog.blogType,
      order: { $gt: blog.order },
    }, // Find blogs with higher order
    { $inc: { order: -1 } } // Decrease order by 1
  );

  res.status(200).json({
    status: true,
    message: "Blog deleted successfully",
  });
});

export const updateBlog = asyncHandler(async (req, res, next) => {
  const blog = await BlogModel.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({
      status: false,
      message: "Blog not found",
    });
  }

  const { title, blogBody, shortTitle, link, blogType, dateMetaData, order } =
    req.body;
  const { icon } = req.files || {};

  // Conditional validation: If 'order' is provided, 'blogType' must also be present
  if (order !== undefined && !blogType) {
    return next(
      new ApiErrorResponse("Blog type is required when providing an order", 400)
    );
  }

  // Get the total number of Blogs for the provided type
  const totalDocuments = await BlogModel.countDocuments({
    blogType,
  });

  // Ensure order is valid
  if (
    order !== undefined &&
    (isNaN(order) || order < 1 || order > totalDocuments)
  ) {
    return next(
      new ApiErrorResponse(
        `Order must be between 1 and ${totalDocuments} (including 1 and ${totalDocuments})`,
        400
      )
    );
  }

  // Handling image update
  if (icon) {
    await deleteFileFromCloudinary(blog.icon); // Delete previous image
    const uploadedIcon = await uploadFileToCloudinary(icon);
    blog.icon = uploadedIcon?.[0] || blog.icon;
  }

  // Updating blog fields if provided
  if (title) blog.title = title;
  if (blogBody) blog.blogBody = blogBody;
  if (shortTitle) blog.shortTitle = shortTitle;
  if (link) blog.link = link;
  if (blogType) blog.blogType = blogType;
  if (dateMetaData) blog.dateMetaData = dateMetaData;

  // Handling order update correctly
  if (order && order !== blog.order) {
    const oldOrder = blog.order;

    if (order > oldOrder) {
      // Moving down: Decrease order of blogs in between <-
      await BlogModel.updateMany(
        { blogType, order: { $gt: oldOrder, $lte: order } },
        { $inc: { order: -1 } }
      );
    } else {
      // Moving up: Increase order of blogs in between->
      await BlogModel.updateMany(
        { blogType, order: { $gte: order, $lt: oldOrder } },
        { $inc: { order: 1 } }
      );
    }

    blog.order = order;
  }

  await blog.save({ runValidators: true });

  return res.status(200).json({
    status: true,
    message: "Blog updated successfully",
    data: blog,
  });
});
