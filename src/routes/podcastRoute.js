import express from "express"
import fileParser from "../middlewares/fileParser.js"
import { createPodcast, getAllPodcasts } from "../controllers/podcastController.js"

const router = express.Router()
router.route("/").post(fileParser,createPodcast).get(getAllPodcasts)

export default router;