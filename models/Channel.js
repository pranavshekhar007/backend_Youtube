import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // Each user can have only one channel
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Channel", ChannelSchema);
