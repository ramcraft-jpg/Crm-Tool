// =============================================
//       NEXUS CRM - TASK CONTROLLER
// =============================================

const Task = require("../models/Task");

// @desc   Get all tasks for logged-in user
// @route  GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.project)  filter.project  = req.query.project;

    const tasks = await Task.find(filter).populate("project", "title").sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching tasks." });
  }
};

// @desc   Get single task by ID
// @route  GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id }).populate("project", "title");

    if (!task) return res.status(404).json({ message: "Task not found." });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching task." });
  }
};

// @desc   Create a new task
// @route  POST /api/tasks
// @access Private
const createTask = async (req, res) => {
  try {
    const { title, description, project, status, priority, dueDate, assignedTo } = req.body;

    if (!title) return res.status(400).json({ message: "Task title is required." });

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      project: project || null,
      status,
      priority,
      dueDate,
      assignedTo,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error creating task." });
  }
};

// @desc   Update a task
// @route  PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) return res.status(404).json({ message: "Task not found." });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error updating task." });
  }
};

// @desc   Delete a task
// @route  DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) return res.status(404).json({ message: "Task not found." });

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting task." });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
