// =============================================
//       NEXUS CRM - PROJECT ROUTES
// =============================================

const express = require("express");
const router = express.Router();

const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// GET  /api/projects      → Get all projects
// POST /api/projects      → Create a project
router.route("/").get(getProjects).post(createProject);

// GET    /api/projects/:id → Get single project
// PUT    /api/projects/:id → Update project
// DELETE /api/projects/:id → Delete project
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);

module.exports = router;
