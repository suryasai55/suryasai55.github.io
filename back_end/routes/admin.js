const express = require("express");
const jwt = require("jsonwebtoken");
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");

const router = express.Router();

// Admin Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({}, process.env.JWT_SECRET, {
      expiresIn: "2h"
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Get Messages (Protected)
router.get("/messages", auth, async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});

module.exports = router;
