import express from "express";
import { createCoInvestor } from "../controllers/coInvestorController.js";
import fileParser from "../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createCoInvestor);

export default router;
