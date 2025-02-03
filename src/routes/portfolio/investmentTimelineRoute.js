import express from "express";
import fileParser from "../../middlewares/fileParser.js";
import { createInvestmentTimeline } from "../../controllers/portfolio/investmentTimelineController.js";

const router = express.Router();

router.route("/").post(fileParser, createInvestmentTimeline);

export default router;
