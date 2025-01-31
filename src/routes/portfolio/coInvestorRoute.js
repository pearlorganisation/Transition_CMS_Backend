import express from "express";
import {
  createCoInvestor,
  getAllCoInvestor,
} from "../../controllers/portfolio/coInvestorController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createCoInvestor).get(getAllCoInvestor);

export default router;
