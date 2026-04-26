// =============================================
//         NEXUS CRM - LEAD ROUTES
// =============================================

const express = require("express");
const router = express.Router();

const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

const { protect } = require("../middleware/authMiddleware");

// All routes are protected (require JWT token)
router.use(protect);

// GET    /api/leads       → Get all leads
// POST   /api/leads       → Create a new lead
router.route("/").get(getLeads).post(createLead);

// GET    /api/leads/:id   → Get single lead
// PUT    /api/leads/:id   → Update lead
// DELETE /api/leads/:id   → Delete lead
router.route("/:id").get(getLeadById).put(updateLead).delete(deleteLead);

module.exports = router;
