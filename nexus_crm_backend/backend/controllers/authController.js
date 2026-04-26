// =============================================
//       NEXUS CRM - AUTH CONTROLLER
// =============================================

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ─────────────────────────────────────────────
//  @desc    Register a new user
//  @route   POST /api/auth/register
//  @access  Public
// ─────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Create new user (password hashed via pre-save hook in model)
    const user = await User.create({ name, email, password });

    if (user) {
      // Generate JWT token
      const token = generateToken(user._id);

      res.status(201).json({
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token, // Send token to frontend for localStorage
      });
    } else {
      res.status(400).json({ message: "Invalid user data. Registration failed." });
    }
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// ─────────────────────────────────────────────
//  @desc    Login user & return JWT token
//  @route   POST /api/auth/login
//  @access  Public
// ─────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check user exists and password matches
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.status(200).json({
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token, // Frontend stores this in localStorage
      });
    } else {
      res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

// ─────────────────────────────────────────────
//  @desc    Get current logged-in user info
//  @route   GET /api/auth/me
//  @access  Private (requires token)
// ─────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("GetMe Error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { registerUser, loginUser, getMe };
