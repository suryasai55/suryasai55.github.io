require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");

const contactRoutes = require("./routes/contact");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= RATE LIMITER =================
// Limit contact form submissions
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per IP per window
  message: {
    error: "Too many contact requests. Please try again later."
  }
});

// ================= FRONTEND SERVE =================
app.use(express.static(path.join(__dirname, "../front_end")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front_end/index.html"));
});

// ================= API ROUTES =================
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API is healthy",
    time: new Date(),
  });
});

// CONTACT FORM API (with limiter)
app.use("/api/contact", contactLimiter, contactRoutes);

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
