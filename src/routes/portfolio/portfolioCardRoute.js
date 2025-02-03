import express from "express";
import fileParser from "../../middlewares/fileParser.js";
import {
  createPortfolioCard,
  deletePortfolioCardById,
  getAllPortfolioCards,
  getPortfolioCardById,
  updatePortfolioCardById,
} from "../../controllers/portfolio/portfolioCardController.js";

const router = express.Router();

router
  .route("/")
  .post(fileParser, createPortfolioCard)
  .get(getAllPortfolioCards);

router
  .route("/:id")
  .get(getPortfolioCardById)
  .patch(fileParser, updatePortfolioCardById)
  .delete(deletePortfolioCardById);

export default router;
