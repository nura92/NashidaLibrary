import express from "express";
import { fetchNashid, downloadNashid } from "../controllers/youtubeController.js";

const router = express.Router();

/**
 * @route GET /api/youtube
 * @desc Fetch Nashid videos from YouTube
 * @query query=<string> - Search term (default: "Islamic Nashid")
 */
router.get("/", async (req, res, next) => {
  console.log("🎵 [API CALL] /api/youtube", { query: req.query.query });
  try {
    await fetchNashid(req, res);
  } catch (err) {
    console.error("❌ Error in /api/youtube:", err.message);
    next(err);
  }
});

/**
 * @route GET /api/youtube/download/:videoId
 * @desc Download Nashid as mp3 or mp4
 * @param videoId=<string> - YouTube video ID
 * @query format=mp3|mp4 (default: mp3)
 */
router.get("/download/:videoId", async (req, res, next) => {
  console.log("⬇️ [API CALL] /api/youtube/download", {
    videoId: req.params.videoId,
    format: req.query.format || "mp3",
  });
  try {
    await downloadNashid(req, res);
  } catch (err) {
    console.error("❌ Error in /api/youtube/download:", err.message);
    next(err);
  }
});

export default router;

