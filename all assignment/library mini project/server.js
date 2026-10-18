
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", require("./routes/bookRoutes"));

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/libraryDB")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Library Management System API is running");
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
