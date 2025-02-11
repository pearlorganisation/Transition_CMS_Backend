import express from "express";
import { createPage } from "../../controllers/page/pageController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createPage);

export default router;
