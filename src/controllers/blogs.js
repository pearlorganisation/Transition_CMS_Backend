
// @desc    Create a new blog
// @route   POST /api/blogs

import { BlogModel } from "../models/blogs.js";
import { uploadFileToCloudinary } from "../utils/cloudinaryConfig.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";

// @access  Public
export const createBlog = asyncHandler(async (req, res) => {
    const { title, shortTitle, dateMetaData, link, blogType, blogBody } = req.body;
    const { icon } = req.files;
    const uploadedIcon = icon ? await uploadFileToCloudinary(icon) : null;
    if (!title  ||!icon ) {
        res.status(400).json({status:true,message:"Title and icons are required fields."});
    }

    const blog = await BlogModel.create({
        title,
        shortTitle,
        dateMetaData,
        link,
        blogType,
        icon:uploadedIcon ? uploadedIcon?.[0] : null ,
        blogBody
    });

    res.status(201).json({
        status: true,
        message: "Blog created successfully",
        blog
    });
});

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await BlogModel.find();
    res.status(200).json({
        status: true,
        message: "Data Fetched successfully",
        data:blogs
    });
});

// @desc    Get a single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
export const getBlogById = asyncHandler(async (req, res) => {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
        res.status(404).json({status:true,message:"Blog not found"})
    }

    res.status(200).json({
        status: true,
        message:"Data Fetched Successfully !!",
        data:blog
    });
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Public
export const updateBlog = asyncHandler(async (req, res) => {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
        res.status(404).json({status:true,message:"Blog updated successfully"});
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: true,
        message: "Blog updated successfully",
        data:updatedBlog
    });
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Public
export const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
        res.status(404).json({status:false,message:"Blog Not Found"});
    }

    await blog.deleteOne();

    res.status(200).json({
        status: true,
        message: "Blog deleted successfully"
    });
});
