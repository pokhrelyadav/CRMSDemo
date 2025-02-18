const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true }, // Slot start time (e.g., "6:00 AM")
  end: { type: String, required: true }, // Slot end time (e.g., "6:30 AM")
  buffer: { type: Number, required: true }, // Buffer time between slots (in minutes)
  capacity: { type: Number, required: true }, // Maximum number of orders per slot
  currentLoad: { type: Number, default: 0 }, // Current number of orders allocated to the slot
});

 module.export = mongoose.model('TimeSlot', timeSlotSchema);