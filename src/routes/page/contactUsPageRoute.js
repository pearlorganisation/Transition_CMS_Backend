import express from "express";
import {
  createContactUsPage,
  getContactUsPage,
} from "../../controllers/page/contactUsPageController.js";
import fileParser from "../../middlewares/fileParser.js";

const router = express.Router();

router.route("/").post(fileParser, createContactUsPage).get(getContactUsPage);

export default router;
