import express from "express";
import { addVideo, addVideos, addView, deleteVideo, getByTag, getUserVideos, getVideo, random, search, sub, trend, upDateVideo } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";
import { uploadFiles } from "../middlewares/multerConfig.js";

const router = express.Router();

router.post("/", verifyToken,uploadFiles, addVideo)
router.post("/add", verifyToken, addVideos);
router.put("/:id", verifyToken, upDateVideo)
router.delete("/:id", verifyToken, deleteVideo)
router.get("/find/:id", getVideo)
router.get("/user/:userId", getUserVideos);
router.put("/view/:id", addView)
router.get("/trend", trend)
router.get("/random", random)
router.get("/sub", verifyToken, sub)
router.get("/tags", getByTag )
router.get("/search",  search)
 
export default router;