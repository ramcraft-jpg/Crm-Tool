// =============================================
//     NEXUS CRM - PROJECT CONTROLLER
// =============================================

const Project = require("../models/Project");

// @desc   Get all projects for logged-in user
// @route  GET /api/projects
// @access Private
const getProjects = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching projects." });
  }
};

// @desc   Get single project by ID
// @route  GET /api/projects/:id
// @access Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });

    if (!project) return res.status(404).json({ message: "Project not found." });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching project." });
  }
};

// @desc   Create a new project
// @route  POST /api/projects
// @access Private
const createProject = async (req, res) => {
  try {
    const { title, description, client, status, priority, startDate, endDate, budget, progress, tags } = req.body;

    if (!title) return res.status(400).json({ message: "Project title is required." });

    const project = await Project.create({
      user: req.user._id,
      title,
      description,
      client,
      status,
      priority,
      startDate,
      endDate,
      budget,
      progress,
      tags,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error creating project." });
  }
};

// @desc   Update a project
// @route  PUT /api/projects/:id
// @access Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });

    if (!project) return res.status(404).json({ message: "Project not found." });

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error updating project." });
  }
};

// @desc   Delete a project
// @route  DELETE /api/projects/:id
// @access Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });

    if (!project) return res.status(404).json({ message: "Project not found." });

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting project." });
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };
