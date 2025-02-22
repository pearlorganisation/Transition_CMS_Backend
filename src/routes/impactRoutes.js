import express from "express";
import {
  createImpact,
  deleteImpact,
  getAllImpact,
  getImpactById,
  updateImpact,
} from "../controllers/impactController.js";
import fileParser from "../middlewares/fileParser.js";

const router = express.Router();

router
  .route("/")
  .post(fileParser, createImpact) // Create Impact
  .get(getAllImpact); // Get All Impact Data

router
  .route("/:id")
  .get(getImpactById) // Get Single Impact Data by ID
  .put(fileParser, updateImpact) // Update Impact Data
  .delete(deleteImpact); // Delete Impact Data

export const impactRouter = router;
