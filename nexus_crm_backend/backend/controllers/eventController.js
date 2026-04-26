// =============================================
//       NEXUS CRM - EVENT CONTROLLER
// =============================================

const Event = require("../models/Event");

// @desc   Get all events for logged-in user
// @route  GET /api/events
// @access Private
const getEvents = async (req, res) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const events = await Event.find(filter).sort({
      startDate: 1,
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    res.status(500).json({
      message: "Server error fetching events.",
    });
  }
};

// @desc   Get single event by ID
// @route  GET /api/events/:id
// @access Private
const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("GET EVENT ERROR:", error);

    res.status(500).json({
      message: "Server error fetching event.",
    });
  }
};

// @desc   Create a new event
// @route  POST /api/events
// @access Private
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      type,
      status,
      attendees,
      isAllDay,
    } = req.body;

    // validation
    if (!title || !startDate) {
      return res.status(400).json({
        message: "Event title and start date are required.",
      });
    }

    const event = await Event.create({
      user: req.user._id,
      title,
      description: description || "",
      location: location || "",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      type: type || "Meeting",
      status: status || "Scheduled",
      attendees: attendees || [],
      isAllDay: isAllDay || false,
    });

    console.log("Event created successfully:", event);

    res.status(201).json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    res.status(500).json({
      message: "Server error creating event.",
      error: error.message,
    });
  }
};

// @desc   Update an event
// @route  PUT /api/events/:id
// @access Private
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    res.status(500).json({
      message: "Server error updating event.",
    });
  }
};

// @desc   Delete an event
// @route  DELETE /api/events/:id
// @access Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    res.status(500).json({
      message: "Server error deleting event.",
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};