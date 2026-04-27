// =============================================
//         NEXUS CRM - AUTH ROUTES
// =============================================

const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// ── HEALTH CHECK / OPTIONS ──
// Accept OPTIONS for login endpoint (CORS preflight, frontend health checks, etc)
router.options("/login", (req, res) => {
  // Simulate "failed to fetch" for demonstration if query string present
  if (req.query.simulate === "fail") {
    return res.status(502).json({
      message: "Could not connect to authentication service or database. (failed to fetch)",
      error:
        process.env.NODE_ENV === "development"
          ? "Simulated fetch failure for testing."
          : undefined,
    });
  }
  res.sendStatus(204); // No Content, endpoint exists (for preflight/health)
});

router.options("/register", (req, res) => {
  // Simulate "failed to fetch" for demonstration if query string present
  if (req.query.simulate === "fail") {
    return res.status(502).json({
      message: "Could not connect to authentication service or database. (failed to fetch)",
      error:
        process.env.NODE_ENV === "development"
          ? "Simulated fetch failure for testing."
          : undefined,
    });
  }
  res.sendStatus(204);
});

// POST /api/auth/register  → Register new user
router.post("/register", registerUser);

// POST /api/auth/login     → Login user, returns JWT token
router.post("/login", loginUser);

// GET  /api/auth/me        → Get current logged-in user (Protected)
router.get("/me", protect, getMe);

module.exports = router;
