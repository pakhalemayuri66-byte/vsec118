const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

// Register student or staff
router.post("/register", async (req, res) => {
  try {
    const { name, collegeId, email, department, password, role } = req.body;

    if (
      !name?.trim() ||
      !collegeId?.trim() ||
      !email?.trim() ||
      !department?.trim() ||
      !password ||
      !["student", "staff"].includes(role)
    ) {
      return res.status(400).json({
        message: "Please fill in all fields correctly.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is missing from server configuration.",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { collegeId: collegeId.trim() },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or college ID is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      collegeId: collegeId.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      password: hashedPassword,
      role,
      approved: role === "student",
    });

    res.status(201).json({
      message:
        role === "staff"
          ? "Staff registration submitted. Wait for admin approval."
          : "Student account created successfully. You can now log in.",
      role: user.role,
      approved: user.approved,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or college ID is already registered.",
      });
    }

    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Registration failed." });
  }
});

// Login with Student or Staff selection
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !["student", "staff"].includes(role)) {
      return res.status(400).json({
        message: "Email, password and account type are required.",
      });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is missing from server configuration.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      role,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email, password or account type.",
      });
    }

    if (user.role === "staff" && !user.approved) {
      return res.status(403).json({
        message: "Your staff account is waiting for admin approval.",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        collegeId: user.collegeId,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed." });
  }
});

// Admin: approve a pending staff account
router.patch("/admin/approve-staff/:id", async (req, res) => {
  try {
    if (!ADMIN_SECRET) {
      return res.status(503).json({
        message: "Admin approval is not configured on the server.",
      });
    }

    if (req.get("x-admin-secret") !== ADMIN_SECRET) {
      return res.status(401).json({
        message: "Unauthorized admin request.",
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "staff" },
      { approved: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "Staff account not found.",
      });
    }

    res.json({
      message: "Staff account approved successfully.",
      staff: {
        id: user._id,
        name: user.name,
        email: user.email,
        approved: user.approved,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid staff account ID." });
    }

    console.error("Approval error:", error.message);
    res.status(500).json({ message: "Could not approve staff account." });
  }
});

module.exports = router;