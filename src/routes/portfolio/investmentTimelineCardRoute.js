import express from "express";
import { createInvestmentTimelineCard } from "../../controllers/portfolio/investmentTimelineCardController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createInvestmentTimelineCard);

export default router;
