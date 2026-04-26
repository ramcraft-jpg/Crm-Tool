// =============================================
//         NEXUS CRM - EVENT ROUTES
// =============================================

const express = require("express");
const router = express.Router();

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// GET  /api/events     → Get all events
// POST /api/events     → Create an event
router.route("/").get(getEvents).post(createEvent);

// GET    /api/events/:id → Get single event
// PUT    /api/events/:id → Update event
// DELETE /api/events/:id → Delete event
router.route("/:id").get(getEventById).put(updateEvent).delete(deleteEvent);

module.exports = router;
