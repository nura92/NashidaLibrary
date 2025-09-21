import axios from "axios";

export const searchYouTube = async (query) => {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        q: query,
        part: "snippet",
        type: "video",
        maxResults: 20,
      },
    });

    return response.data.items;
  } catch (error) {
    console.error("❌ YouTube API error:", error.response?.data || error.message);
    throw error;
  }
};
