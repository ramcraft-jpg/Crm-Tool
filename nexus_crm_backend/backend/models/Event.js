// =============================================
//          NEXUS CRM - EVENT MODEL
// =============================================

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      required: [true, "Event start date is required"],
    },
    endDate: {
      type: Date,
    },
    type: {
      type: String,
      enum: ["Meeting", "Call", "Demo", "Follow-up", "Deadline", "Other"],
      default: "Meeting",
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    attendees: {
      type: [String],
      default: [],
    },
    isAllDay: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
