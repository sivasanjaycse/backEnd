const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create an event (Admin only)
// @route   POST /api/events
exports.createEvent = async (req, res) => {
  const { 
    title, 
    description, 
    date, 
    time, 
    location, 
    externalLink, 
    eventType, 
    image, 
    audience 
  } = req.body;
  
  try {
    const event = new Event({ 
        title, 
        description, 
        date, 
        time, 
        location, 
        externalLink,
        eventType, 
        image, 
        audience 
    });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};