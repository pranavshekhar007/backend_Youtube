import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const addComment = async (req, res, next) => {
    if (!req.user) {
        return next(createError(401, "User not authenticated"));
    }

    const newComment = new Comment({ ...req.body,
        videoId: String(req.body.videoId), userId: req.user.id });

    try {
        const savedComment = await newComment.save();
        res.status(200).json(savedComment);
    } catch (err) {
        next(err);
    }
};


export const deleteComment = async (req, res, next) => {
    try {
        // Find the comment by ID
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(createError(404, "Comment not found!"));
        }

        // Check if the videoId is valid before querying
        if (!comment.videoId) {
            return next(createError(400, "Invalid comment data!"));
        }

        // Find the video related to the comment
        const video = await Video.findById(comment.videoId);
        if (!video) {
 
            await Comment.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Comment deleted" });
        }
        if (req.user.id === comment.userId || req.user.id === video.userId) {
 
            await Comment.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Comment deleted successfully." });
        } else {
            return next(createError(403, "You can delete only your own comment!"));
        }
    } catch (err) {
        console.error("Error deleting comment:", err);
        next(err);
    }
};



export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ videoId: String(req.params.videoId) });
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};
