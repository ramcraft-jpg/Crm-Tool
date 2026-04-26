// =============================================
//       NEXUS CRM - PROFILE ROUTES
// =============================================

const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// GET /api/profile     → Get current user profile
// PUT /api/profile     → Update profile info
router.route("/").get(getProfile).put(updateProfile);

// PUT /api/profile/change-password → Change password
router.put("/change-password", changePassword);

module.exports = router;
