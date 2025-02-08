import express from "express";

import fileParser from "../middlewares/fileParser.js";
import {
  createFocusFeature,
  deleteFocusFeature,
  getAllFocusFeatures,
  getSingleFocusFeature,
  updateFocusFeature,
} from "../controllers/singleFeatureController.js";

const router = express.Router();

router.route("/").get(getAllFocusFeatures).post(fileParser, createFocusFeature);
router
  .route("/:id")
  .get(getSingleFocusFeature)
  .delete(deleteFocusFeature)
  .patch(fileParser, updateFocusFeature);

export default router;
