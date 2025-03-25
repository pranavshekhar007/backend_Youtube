import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  // getChannelVideos,
} from "../controllers/channel.js";
// import { addChannelVideo } from "../controllers/video.js";

const router = express.Router();

// Create a channel (Only if user is signed in)
router.post("/", verifyToken, createChannel);

// router.post("/:channelId/videos", verifyToken, addChannelVideo);

// Get a channel by user ID
router.get("/:userId", getChannel);

// Update a channel (Only the owner can update)
router.put("/:id", verifyToken, updateChannel);

// Delete a channel (Only the owner can delete)
router.delete("/:id", verifyToken, deleteChannel);

// Get all videos for a particular channel
// router.get("/:id/videos", getChannelVideos);

export default router;
