import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

// ✅ Create a channel
export const createChannel = async (req, res, next) => {
  try {
    // Check if user already has a channel
    const existingChannel = await Channel.findOne({ userId: req.user.id });
    if (existingChannel) return next(createError(400, "Channel already exists!"));

    const newChannel = new Channel({
      userId: req.user.id,
      name: req.body.name,
      description: req.body.description,
    });

    const savedChannel = await newChannel.save();
    res.status(200).json(savedChannel);
  } catch (err) {
    next(err);
  }
};

// ✅ Get a channel by user ID
export const getChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findOne({ userId: req.params.userId });
    if (!channel) return next(createError(404, "Channel not found!"));
    res.status(200).json(channel);
  } catch (err) {
    next(err);
  }
};

// ✅ Update a channel (Only owner can update)
export const updateChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return next(createError(404, "Channel not found!"));

    if (req.user.id !== channel.userId)
      return next(createError(403, "You can update only your channel!"));

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedChannel);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete a channel (Only owner can delete)
export const deleteChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return next(createError(404, "Channel not found!"));

    if (req.user.id !== channel.userId)
      return next(createError(403, "You can delete only your channel!"));

    await Channel.findByIdAndDelete(req.params.id);
    res.status(200).json("Channel deleted successfully.");
  } catch (err) {
    next(err);
  }
};

// ✅ Get all videos of a specific channel
export const getChannelVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({ userId: req.params.id });
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
