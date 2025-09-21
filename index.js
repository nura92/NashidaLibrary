import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import youtubeRoutes from "./routes/youtube.js";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());

// Categories endpoint
app.get("/api/categories", (req, res) => {
  try {
    const categoriesPath = path.join(process.cwd(), "data", "categories.json");
    if (!fs.existsSync(categoriesPath)) {
      return res.status(404).json({ error: "categories.json not found" });
    }
    const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to load categories", details: err.message });
  }
})

// YouTube routes
app.use("/api/youtube", youtubeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
