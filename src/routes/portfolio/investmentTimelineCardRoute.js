import express from "express";
import {
  createInvestmentTimelineCard,
  deleteInvestmentTimelineCardById,
  getAllInvestmentTimelineCards,
  getInvestmentTimelineCardById,
  updateInvestmentTimelineCardById,
} from "../../controllers/portfolio/investmentTimelineCardController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router
  .route("/")
  .post(fileParser, createInvestmentTimelineCard)
  .get(getAllInvestmentTimelineCards);
router
  .route("/:id")
  .get(getInvestmentTimelineCardById)
  .patch(fileParser, updateInvestmentTimelineCardById)
  .delete(deleteInvestmentTimelineCardById);

export default router;
