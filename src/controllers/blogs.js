// @desc    Create a new blog
// @route   POST /api/blogs

import { copyFileSync } from "fs";
import { BlogModel } from "../models/blogs.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../utils/cloudinaryConfig.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";

// @access  Public
export const createBlog = asyncHandler(async (req, res) => {
  const { title, shortTitle, dateMetaData, link, blogType, blogBody, order } =
    req.body;
  const { icon } = req.files;
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
    order: order || (await BlogModel.countDocuments({ blogType })) + 1, // Assign order if not provided
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

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Public
// export const updateBlog = asyncHandler(async (req, res) => {
//   const blog = await BlogModel.findById(req.params.id);
//   const { title, blogBody, shortTitle, link, blogType, dateMetaData, order } =
//     req.body;

//   const { icon } = req.files;
//   if (!blog) {
//     res.status(404).json({
//       status: true,
//       message: "Blog not found successfully",
//     });
//   }
//   // if(icon){
//   // const uploadedIcon = icon ? await uploadFileToCloudinary(icon) : null;
//   // await deleteFileFromCloudinary(blog.icon) // utility function to delete the icon

//   // console.log("the requested body is", req.body)

//   // const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, {...req.body,
//   //     icon: uploadedIcon?uploadedIcon?.[0] : null
//   // }, {
//   //     new: true,
//   //     runValidators: true
//   // });

//   // res.status(200).json({
//   //     status: true,
//   //     message: "Blog updated successfully",
//   //     data:updatedBlog
//   // });}else{
//   //         const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id,req.body, {
//   //             new: true,
//   //             runValidators: true
//   //         });

//   //         res.status(200).json({
//   //             status: true,
//   //             message: "Blog updated successfully",
//   //             data: updatedBlog
//   //         });
//   // }

//   // const payload ={};
//   if (icon) {
//     await deleteFileFromCloudinary(blog?.icon); // first deleting the previous image
//     const upload = await uploadFileToCloudinary(icon);
//     //payload.icon = upload[0]
//     blog.icon = upload?.[0];
//   }
//   if (title) {
//     blog.title = title;
//   }
//   if (blogBody) {
//     blog.blogBody = blogBody;
//   }
//   if (shortTitle) {
//     blog.shortTitle = shortTitle;
//   }

//   if (link) {
//     blog.link = link;
//   }
//   if (blogType) {
//     blog.blogType = blogType;
//   }
//   if (dateMetaData) {
//     blog.dateMetaData = dateMetaData;
//   }
//   if (order) {
//     blog.order = order;
//   }
//   await blog.save({ runValidators: false });
//   return res.status(200).json({
//     status: true,
//     message: "Blog updated successfully",
//     data: blog,
//   });
// });

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Public
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await BlogModel.findById(req.params.id);

  if (!blog) {
    res.status(404).json({ status: false, message: "Blog Not Found" });
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

export const updateBlog = asyncHandler(async (req, res) => {
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
