import express from "express";

import {
  createTeam,
  deleteTeam,
  getAllTeams,
  getSingleTeam,
  updateTeam,
} from "../controllers/teamController.js";
import fileParser from "../middlewares/fileParser.js";

const router = express.Router();

router.route("/").get(getAllTeams).post(fileParser, createTeam);
router
  .route("/:id")
  .delete(deleteTeam)
  .get(getSingleTeam)
  .patch(fileParser, updateTeam);

export default router;
