import express from "express";

import fileParser from "../middlewares/fileParser.js";
import {
  createTeamDetails,
  deleteTeamDetails,
  getAllTeamDetails,
  getSingleTeamDetails,
  updateTeamDetails,
} from "../controllers/teamDetailsController.js";

const router = express.Router();

router.route("/").get(getAllTeamDetails).post(fileParser, createTeamDetails);
router
  .route("/:id")
  .get(getSingleTeamDetails)
  .delete(deleteTeamDetails)
  .patch(fileParser, updateTeamDetails);

export default router;
