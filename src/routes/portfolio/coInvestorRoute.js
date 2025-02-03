import express from "express";
import {
  createCoInvestor,
  deleteCoInvestorById,
  getAllCoInvestor,
  updateCoInvestorById,
} from "../../controllers/portfolio/coInvestorController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createCoInvestor).get(getAllCoInvestor); // No need for get api
router
  .route("/:id")
  .patch(fileParser, updateCoInvestorById)
  .delete(deleteCoInvestorById);

export default router;
