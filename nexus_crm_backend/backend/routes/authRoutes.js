// =============================================
//         NEXUS CRM - AUTH ROUTES
// =============================================

const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register  → Register new user
router.post("/register", registerUser);

// POST /api/auth/login     → Login user, returns JWT token
router.post("/login", loginUser);

// GET  /api/auth/me        → Get current logged-in user (Protected)
router.get("/me", protect, getMe);

module.exports = router;
