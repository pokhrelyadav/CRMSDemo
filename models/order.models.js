const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  orders: [
    {
      foodType: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
  },
  orderTime: {
     type: String, 
     required: false},//? was true
 
  status: { type: String, enum: ['Pending', 'Allocated', 'Ready', 'Rejected'], default: 'Pending' },
  priority: { type: Number, default: 0 }, // Priority score calculated by the algorithm
  classType: { type: String, enum: ['high', 'low'], default: 'low' }, // Order classification (high/low priority)
  assignedSlot: { type: String, default: null },
  message: {
    type: String,
  },
  roomNo: {
    type: String,
  },
  isConfirmed: {
    type: Boolean,
    default: null,
  },
  paymentType: {
    type: String,
    default: "",
    enum: ["online", "offline", ""],
  },
  paymentStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("order", OrderSchema);
