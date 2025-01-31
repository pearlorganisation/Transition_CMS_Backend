import express from "express";

import {
  createFocusArea,
  deleteFocusArea,
  getFocusAreas,
  getSinlgeFocusArea,
  updateFocusArea,
} from "../controllers/focusAreaController.js";

const router = express.Router();

router.route("/").get(getFocusAreas).post(createFocusArea);
router
  .route("/:id")
  .get(getSinlgeFocusArea)
  .delete(deleteFocusArea)
  .patch(updateFocusArea);

export default router;
