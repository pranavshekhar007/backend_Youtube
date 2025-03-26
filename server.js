import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import videos from "./routes/videos.js";
import comments from "./routes/comments.js";
import channels from "./routes/channels.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 7071;
const FRONTEND_URLS = [
  "http://localhost:5173", // Localhost for development
  "https://youtube-deploy-1fee.vercel.app", // Deployed frontend
];


mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.warn("Connected to DB");
  })
  .catch((err) => {
    throw err;
  });


// ✅ Fix CORS: Allow both localhost and deployed frontend
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || FRONTEND_URLS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Fix Preflight Requests for CORS
app.options("*", cors()); // Handles preflight requests for all routes

app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send(` Backend is live on ${PORT}`));
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/videos", videos);
app.use("/api/comments", comments);
app.use("/api/channels", channels);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
