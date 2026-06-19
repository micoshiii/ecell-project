const express = require("express");
const { authMiddleware } = require("./middleware");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { connectDB, userModel, slideModel } = require("./models");

const app = express();
app.use(express.json());
app.use(require("cors")());

connectDB();

// Configure Cloudinary using your .env values
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── AUTH ──────────────────────────────────────

app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  const userExists = await userModel.findOne({ username });
  if (userExists)
    return res.status(403).json({ message: "User already exists" });

  const newUser = await userModel.create({ username, password });
  res.json({ id: newUser._id });
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username, password });
  if (!user)
    return res.status(403).json({ message: "Incorrect credentials" });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// ── CLOUDINARY SIGNED URL (Protected) ────────
// Frontend calls this first to get a signature,
// then uploads the file directly to Cloudinary.
// Your secret never goes to the frontend.

app.post("/api/sign-url", authMiddleware, (req, res) => {
  try {
    const { folder = "slides", public_id } = req.body;

    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      folder,
      ...(public_id && { public_id }),
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not generate signature", error: err.message });
  }
});

// ── SLIDES ────────────────────────────────────

// GET all slides — Public
// Example: /api/slides?page=1&limit=10&search=finance&tags=strategy&sortBy=createdAt&order=desc
app.get("/api/slides", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      tags = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by tags (comma separated e.g. "finance,strategy")
    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim()).filter(Boolean);
      if (tagArray.length) filter.tags = { $in: tagArray };
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const allowedSortFields = ["createdAt", "title"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const skip = (Number(page) - 1) * Number(limit);

    const [slides, total] = await Promise.all([
      slideModel
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(Number(limit)),
      slideModel.countDocuments(filter),
    ]);

    res.json({
      slides,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET single slide by ID — Public
app.get("/api/slides/:id", async (req, res) => {
  try {
    const slide = await slideModel.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });
    res.json(slide);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST new slide — Protected
// Call /api/sign-url first → upload file to Cloudinary → then call this with the URL
app.post("/api/slides", authMiddleware, async (req, res) => {
  try {
    const { title, description, tags, previewImage, slideUrl } = req.body;

    if (!title || !slideUrl)
      return res.status(400).json({ message: "title and slideUrl are required" });

    const slide = await slideModel.create({
      title,
      description,
      tags: Array.isArray(tags)
        ? tags
        : tags
        ? tags.split(",").map((t) => t.trim())
        : [],
      previewImage,
      slideUrl,
      uploadedBy: req.userId,
    });

    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT update slide — Protected (only original uploader)
app.put("/api/slides/:id", authMiddleware, async (req, res) => {
  try {
    const slide = await slideModel.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    if (slide.uploadedBy.toString() !== req.userId)
      return res.status(403).json({ message: "Not authorised to edit this slide" });

    const { title, description, tags, previewImage, slideUrl } = req.body;

    const updated = await slideModel.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(tags && {
          tags: Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()),
        }),
        ...(previewImage && { previewImage }),
        ...(slideUrl && { slideUrl }),
      },
      { returnDocument: 'after' }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE slide — Protected (only original uploader)
app.delete("/api/slides/:id", authMiddleware, async (req, res) => {
  try {
    const slide = await slideModel.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    if (slide.uploadedBy.toString() !== req.userId)
      return res.status(403).json({ message: "Not authorised to delete this slide" });

    await slideModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Slide deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));