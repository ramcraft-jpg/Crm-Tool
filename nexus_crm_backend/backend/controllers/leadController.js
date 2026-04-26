// =============================================
//       NEXUS CRM - LEAD CONTROLLER
// =============================================

const Lead = require("../models/Lead");

// ─────────────────────────────────────────────
//  @desc    Get all leads for logged-in user
//  @route   GET /api/leads
//  @access  Private
// ─────────────────────────────────────────────
const getLeads = async (req, res) => {
  try {
    // Optionally filter by status via query param: /api/leads?status=New
    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    console.error("Get Leads Error:", error.message);
    res.status(500).json({ message: "Server error fetching leads." });
  }
};

// ─────────────────────────────────────────────
//  @desc    Get single lead by ID
//  @route   GET /api/leads/:id
//  @access  Private
// ─────────────────────────────────────────────
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.user._id });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.status(200).json(lead);
  } catch (error) {
    console.error("Get Lead Error:", error.message);
    res.status(500).json({ message: "Server error fetching lead." });
  }
};

// ─────────────────────────────────────────────
//  @desc    Create a new lead
//  @route   POST /api/leads
//  @access  Private
// ─────────────────────────────────────────────
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, source, status, notes, value } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const lead = await Lead.create({
      user: req.user._id,
      name,
      email,
      phone,
      company,
      source,
      status,
      notes,
      value,
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error("Create Lead Error:", error.message);
    res.status(500).json({ message: "Server error creating lead." });
  }
};

// ─────────────────────────────────────────────
//  @desc    Update a lead by ID
//  @route   PUT /api/leads/:id
//  @access  Private
// ─────────────────────────────────────────────
const updateLead = async (req, res) => {
  try {
    // Only the owner can update their lead
    const lead = await Lead.findOne({ _id: req.params.id, user: req.user._id });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc + run schema validators
    );

    res.status(200).json(updatedLead);
  } catch (error) {
    console.error("Update Lead Error:", error.message);
    res.status(500).json({ message: "Server error updating lead." });
  }
};

// ─────────────────────────────────────────────
//  @desc    Delete a lead by ID
//  @route   DELETE /api/leads/:id
//  @access  Private
// ─────────────────────────────────────────────
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.user._id });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    await lead.deleteOne();
    res.status(200).json({ message: "Lead deleted successfully." });
  } catch (error) {
    console.error("Delete Lead Error:", error.message);
    res.status(500).json({ message: "Server error deleting lead." });
  }
};

module.exports = { getLeads, getLeadById, createLead, updateLead, deleteLead };
