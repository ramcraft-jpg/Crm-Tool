// =============================================
//       NEXUS CRM - DASHBOARD ROUTES
// =============================================

const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/dashboard/stats → Get all dashboard stats (Protected)
router.get("/stats", protect, getDashboardStats);

module.exports = router;
