// =============================================
//          NEXUS CRM - LEAD MODEL
// =============================================

const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    // Reference to the user who created the lead
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Lead email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    source: {
      type: String,
      enum: ["Website", "Referral", "Social Media", "Email", "Cold Call", "Other"],
      default: "Other",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted", "Lost"],
      default: "New",
    },
    notes: {
      type: String,
      default: "",
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead;
