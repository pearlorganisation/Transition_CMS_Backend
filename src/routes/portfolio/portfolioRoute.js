import express from "express";
import { createPortfolio } from "../../controllers/portfolio/portfolioController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createPortfolio);

export default router;
