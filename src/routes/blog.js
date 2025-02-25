import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../controllers/blogs.js";
import fileParser from "../middlewares/fileParser.js";

const router = express.Router();

router
  .route("/")
  .post(fileParser, createBlog) // Create Blog
  .get(getAllBlogs); // Get All Blogs

router
  .route("/:id")
  .put(fileParser, updateBlog)
  .get(getBlogById) // Get Blog by ID
  // Update Blog
  .delete(deleteBlog); // Delete Blog

export const blogRouter = router;
