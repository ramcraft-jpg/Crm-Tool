// =============================================
//     NEXUS CRM - PROFILE CONTROLLER
// =============================================

const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ─────────────────────────────────────────────
//  @desc    Get logged-in user's profile
//  @route   GET /api/profile
//  @access  Private
// ─────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) return res.status(404).json({ message: "Profile not found." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching profile." });
  }
};

// ─────────────────────────────────────────────
//  @desc    Update logged-in user's profile
//  @route   PUT /api/profile
//  @access  Private
// ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, company, avatar, bio } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found." });

    // Update fields if provided
    if (name)    user.name    = name;
    if (email)   user.email   = email;
    if (phone)   user.phone   = phone;
    if (company) user.company = company;
    if (avatar)  user.avatar  = avatar;
    if (bio)     user.bio     = bio;

    const updatedUser = await user.save();

    res.status(200).json({
      _id:     updatedUser._id,
      name:    updatedUser.name,
      email:   updatedUser.email,
      phone:   updatedUser.phone,
      company: updatedUser.company,
      avatar:  updatedUser.avatar,
      bio:     updatedUser.bio,
      role:    updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error updating profile." });
  }
};

// ─────────────────────────────────────────────
//  @desc    Update user password
//  @route   PUT /api/profile/change-password
//  @access  Private
// ─────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide current and new passwords." });
    }

    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    // Set new password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error changing password." });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
