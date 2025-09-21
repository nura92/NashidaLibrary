import axios from "axios";
import ytdl from "ytdl-core";

// Fetch Nashid videos from YouTube with pagination and "new today" filter
export const fetchNashid = async (req, res) => {
  try {
    const query = (req.query.query || "Islamic Nashid").trim();
    const pageToken = req.query.pageToken || ""; // for pagination
    const maxResults = parseInt(req.query.maxResults) || 12;
    const publishedAfter = req.query.publishedAfter || null; // for "new today"

    const params = {
      key: process.env.YOUTUBE_API_KEY,
      q: query,
      part: "snippet",
      type: "video",
      maxResults,
      pageToken
    };

    if (publishedAfter) {
      params.publishedAfter = publishedAfter; // ISO date string
    }

    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", { params });

    // Return videos + nextPageToken
    res.json({
      videos: response.data.items,
      nextPageToken: response.data.nextPageToken || null
    });

    console.log(`🎵 Fetched ${response.data.items.length} videos for query: ${query}${publishedAfter ? " (New Today)" : ""}`);
  } catch (error) {
    console.error("❌ YouTube fetch error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch Nashid videos" });
  }
};

// Download feature (audio/video)
export const downloadNashid = async (req, res) => {
  try {
    const videoId = req.params.videoId?.trim();
    const format = (req.query.format || "mp3").trim().toLowerCase();

    // Validate videoId
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return res.status(400).json({ error: "Invalid video ID" });
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    if (format === "mp3") {
      res.header("Content-Disposition", `attachment; filename="nashid-${videoId}.mp3"`);
      ytdl(url, { filter: "audioonly" }).pipe(res);
    } else if (format === "mp4") {
      res.header("Content-Disposition", `attachment; filename="nashid-${videoId}.mp4"`);
      ytdl(url, { quality: "highest" }).pipe(res);
    } else {
      return res.status(400).json({ error: "Invalid format, must be mp3 or mp4" });
    }

    console.log(`⬇️ Downloading ${format} for videoId: ${videoId}`);
  } catch (error) {
    console.error("❌ Download error:", error.message);
    res.status(500).json({ error: "Download failed" });
  }
};
