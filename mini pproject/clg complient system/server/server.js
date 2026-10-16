const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//const authRoutes = require("routes/auth");

const authRoutes = require("./routes/auth.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;



const MONGO_URI =

  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/college_complaints";

// Complaint Schema
const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Declare the model only once
const Complaint = mongoose.model("Complaint", complaintSchema);

// Home route
app.get("/", (req, res) => {
  res.send("CampusCare Backend is running!");
});

// GET: View complaints
app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Create complaint
app.post("/api/complaints", async (req, res) => {
  try {
    const { title, category, description, status } = req.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof category !== "string" || !category.trim() ||
      typeof description !== "string" || !description.trim()
    ) {
      return res.status(400).json({
        message: "Title, category, and description are required.",
      });
    }

    const complaint = await Complaint.create({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      status: status || "Pending",
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH: Update complaint status
app.patch("/api/complaints/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }

    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove complaint
app.delete("/api/complaints/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found.",
      });
    }

    res.json({ message: "Complaint deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Connect MongoDB and start server
async function startServer() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected successfully!");
    console.log("Database:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exitCode = 1;
  }
}

startServer();
