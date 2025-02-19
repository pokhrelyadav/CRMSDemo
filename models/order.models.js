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
    default: 0
  },
  orderTime: {
     type: String, 
     required: false},//? was true
 
  status: { type: String, enum: ['Pending', 'Allocated', 'Ready', 'Rejected'], default: 'Pending' },
  priority: { type: Number, default: 0 }, // Priority score calculated by the algorithm
  urgency: { type: Number, default: 10 }, // Order classification (high/low priority)
  assignedSlot: { type: String, default: null },
  message: {
    type: String,
  },
  roomNo: {
    type: String,
  },
  isConfirmed: {
    type: Boolean,
    default: false, //! untill the admin corrects it.
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
// Function to calculate total price
function calculateTotalPrice(orders) {
  return orders.reduce((sum, order) => sum + order.price * order.quantity, 0);
}

// Pre-save hook for new or updated orders
OrderSchema.pre("save", function (next) {
  this.totalPrice = calculateTotalPrice(this.orders);
  next();
});

// Pre-update hook to recalculate totalPrice on updates
OrderSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.orders) {
    const newTotalPrice = calculateTotalPrice(update.orders);
    this.set({ totalPrice: newTotalPrice });
  }
  next();
});
// Add calculateFrequency as a static method
OrderSchema.statics.calculateFrequency = async function (userId) {
  const now = new Date();
  const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1)); // Last 30 days

  const orderCount = await this.countDocuments({
      user: userId,
      date: { $gte: oneMonthAgo },
  });

  // Return 1 for new users (no orders)
  return orderCount === 0 ? 1 : orderCount;
};
module.exports = mongoose.model("order", OrderSchema);
