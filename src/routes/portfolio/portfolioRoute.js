import express from "express";
import {
  createPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolioById,
} from "../../controllers/portfolio/portfolioController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createPortfolio).get(getAllPortfolios);
router
  .route("/:id")
  .get(getPortfolioById)
  .patch(fileParser, updatePortfolioById);

export default router;
