const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UserProfile = require("../models/UserProfile");

// Auth middleware (kept in this file so no missing module errors)
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create or Update Profile
router.post("/", auth, async (req, res) => {
  try {
    const existing = await UserProfile.findOne({ userId: req.user.userId });

    if (existing) {
      const updated = await UserProfile.findOneAndUpdate(
        { userId: req.user.userId },
        req.body,
        { new: true }
      );
      return res.json(updated);
    } else {
      const profile = new UserProfile({ ...req.body, userId: req.user.userId });
      await profile.save();
      return res.status(201).json(profile);
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Update profile
router.put("/", auth, async (req, res) => {
  try {
    const updated = await UserProfile.findOneAndUpdate(
      { userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Get Logged-in User’s Profile
router.get("/", auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.userId });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

router.get("/aman", async (req, res) => {
    res.status(500).json({ message: "Error fetching profile" });
  })

module.exports = router;





/////alishba bawli
