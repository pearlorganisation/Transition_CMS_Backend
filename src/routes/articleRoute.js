import express from "express";
import { createArticle, getAllArticles } from "../controllers/articleController.js";
import fileParser from "../middlewares/fileParser.js";

const router = express.Router()

router.route("/").post(fileParser,createArticle).get(getAllArticles)

export default router;