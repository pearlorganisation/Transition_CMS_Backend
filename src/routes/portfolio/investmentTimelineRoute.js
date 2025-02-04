import express from "express";
import fileParser from "../../middlewares/fileParser.js";
import {
  createInvestmentTimeline,
  deleteInvestmentTimelineById,
  getAllInvestmentTimelines,
  getInvestmentTimelineById,
  updateInvestmentTimelineById,
} from "../../controllers/portfolio/investmentTimelineController.js";

const router = express.Router();

router
  .route("/")
  .post(fileParser, createInvestmentTimeline)
  .get(getAllInvestmentTimelines);

router
  .route("/:id")
  .get(getInvestmentTimelineById)
  .patch(fileParser, updateInvestmentTimelineById)
  .delete(deleteInvestmentTimelineById);

export default router;
