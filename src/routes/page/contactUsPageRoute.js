import express from "express";
 
import fileParser from "../../middlewares/fileParser.js";
import { createContact, getContacts } from "../../controllers/page/contact.js";

const router = express.Router();

router.route("/").post(createContact).get(getContacts);

export default router;
