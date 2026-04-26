// =============================================
//     NEXUS CRM - DASHBOARD CONTROLLER
// =============================================

const Lead    = require("../models/Lead");
const Project = require("../models/Project");
const Task    = require("../models/Task");
const Event   = require("../models/Event");

// ─────────────────────────────────────────────
//  @desc    Get all dashboard stats for logged-in user
//  @route   GET /api/dashboard/stats
//  @access  Private
// ─────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // ── Count Totals ──────────────────────────────────────────────────────────
    const [totalLeads, totalProjects, totalTasks, totalEvents] = await Promise.all([
      Lead.countDocuments({ user: userId }),
      Project.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId }),
      Event.countDocuments({ user: userId }),
    ]);

    // ── Lead Status Breakdown (for Pie Chart) ─────────────────────────────────
    const [newLeads, contactedLeads, convertedLeads] = await Promise.all([
      Lead.countDocuments({ user: userId, status: "New" }),
      Lead.countDocuments({ user: userId, status: "Contacted" }),
      Lead.countDocuments({ user: userId, status: "Converted" }),
    ]);

    // ── Recent Activity ───────────────────────────────────────────────────────
    const [latestLead, latestTask, latestEvent] = await Promise.all([
      Lead.findOne({ user: userId }).sort({ createdAt: -1 }).select("name email status createdAt"),
      Task.findOne({ user: userId }).sort({ createdAt: -1 }).select("title status priority createdAt"),
      Event.findOne({ user: userId }).sort({ createdAt: -1 }).select("title type startDate status createdAt"),
    ]);

    // ── Upcoming Events (scheduled events from today onwards) ─────────────────
    const upcomingEvents = await Event.find({
      user: userId,
      startDate: { $gte: new Date() },
      status: "Scheduled",
    })
      .sort({ startDate: 1 }) // Ascending: nearest first
      .limit(5)
      .select("title type startDate location");

    // ── Build Response ─────────────────────────────────────────────────────────
    res.status(200).json({
      totalLeads,
      totalProjects,
      totalTasks,
      totalEvents,
      leadStatus: {
        new:       newLeads,
        contacted: contactedLeads,
        converted: convertedLeads,
      },
      recentActivity: {
        latestLead,
        latestTask,
        latestEvent,
      },
      upcomingEvents,
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error.message);
    res.status(500).json({ message: "Server error loading dashboard stats." });
  }
};

module.exports = { getDashboardStats };
