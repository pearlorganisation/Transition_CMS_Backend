import express from "express";

import fileParser from "../middlewares/fileParser.js";
import {
  createNews,
  deleteNews,
  getAllNews,
  getSingleNews,
  updateNews,
} from "../controllers/newsController.js";

const router = express.Router();

router.route("/").get(getAllNews).post(fileParser, createNews);
router.route("/:id").delete(deleteNews).get(getSingleNews).patch(updateNews);

export default router;
