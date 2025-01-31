import express from "express";
import fileParser from "../../middlewares/fileParser.js";
import { createPortfolioCard } from "../../controllers/portfolio/portfolioCardController.js";

const router = express.Router();

router.route("/").post(fileParser, createPortfolioCard);

export default router;
