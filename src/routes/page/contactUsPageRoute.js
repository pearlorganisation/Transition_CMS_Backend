import express from "express";
import {
  createContact,
  deleteContactById,
  getContacts,
  updateContactById,
} from "../../controllers/page/contact.js";

const router = express.Router();

router.route("/").post(createContact).get(getContacts);
router.route("/:id").patch(updateContactById).delete(deleteContactById);

export default router;
