const express = require("express");
const Order = require("../models/order.models");
const User = require("../models/auth.models");
const router = express.Router();
const auth = require("../middleware/auth");
const MDPSystem = require("../service/timeManagement");
const prompt = require("prompt-sync") ({sigint: true});

//? timeslot for the references
const timeSlots = [
  { start: "6:00 AM", end: "6:30 AM", buffer: 10 },
  { start: "6:40 AM", end: "7:10 AM", buffer: 10 },
  { start: "7:20 AM", end: "7:50 AM", buffer: 10 },
  { start: "8:00 AM", end: "8:30 AM", buffer: 10 },
  { start: "8:40 AM", end: "9:10 AM", buffer: 10 },
  { start: "9:20 AM", end: "9:50 AM", buffer: 10 },
  { start: "10:00 AM", end: "10:30 AM", buffer: 10 },
  { start: "10:40 AM", end: "11:10 AM", buffer: 10 },
  { start: "11:20 AM", end: "11:50 AM", buffer: 10 },
  { start: "12:00 PM", end: "12:30 PM", buffer: 10 },
];

const costs = { rejection: 10, earlyService: 5, overtime: 15 };
const maxCapacity= 2;
const mdpSystem = new MDPSystem(timeSlots, costs, maxCapacity);

// get admin orders : GET (private)
router.get("/orders", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.isAdmin) {
      const orders = await Order.find({ paymentStatus: false })
        .populate("user", "name branch role")
        .sort("-date");
      res.json({ data: orders });
    } else {
      return res.status(401).json({ msg: "You can't access this route" });
    }
  } catch (err) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// get user(my) orders : GET (private)
router.get("/myorders", auth, async (req, res) => {
  try {
    const result = await Order.find({ user: req.user.id }).sort("-date");
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// post orders : POST (private)
// router.post("/place/order", auth, async (req, res) => {
//   try {
//     const user = req.user.id;

//     const order = new Order({
//       user,
//       orders: req.body.cart,
//       totalPrice: req.body.totalPrice,
//       roomNo: req.body.roomNo,
//       message: req.body.message ? req.body.message : "",
//       paymentType: "",
//     });

//     await order.save();

//     res.json(order);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
//   mdpSystem.allocateOrders([order]);
// });

// ? post 2
// router.post("/place/order", auth, async (req, res) => {
//   try {
//     const user = req.user.id;

//     // Extracting data from the request body
//     const {
//       cart, // Assuming cart is an array of order items
//       totalPrice,
//       roomNo,
//       message,
//       paymentType,
//       orderTime,
//       assignedSlot
//     } = req.body;

//     // Create a new order instance
//     const order = new Order({
//       user,
//       orders: cart, // Assuming cart is structured correctly as per the schema
//       totalPrice,
//       roomNo,
//       message: message ? message : "", // Added preferredSlot
//       paymentType: paymentType || "", // Default to empty string if not provided
//       orderTime: orderTime,
//       assignedSlot: assignedSlot
//     });

//     await order.save();//? new try
//      mdpSystem.reallocateOrders([order]);
//     //   // After allocation, update the order with the assigned slot
// if (order.timeSlot) {
//   order.assignedSlot = order.timeSlot; // Update assignedSlot with the allocated time slot
//  await order.save(); // Save the updated order
//     }

//     // Respond with the created order
//     res.status(201).json({
//       success: true,
//       order
//       });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// });

// ? try 3
router.post("/place/order", auth, async (req, res) => {
  try {
    const user = req.user.id;

    // Extracting data from the request body
    const {
      cart, // Assuming cart is an array of order items
      totalPrice,
      roomNo,
      message,
      paymentType,
      orderTime,
      assignedSlot,
      priority
    } = req.body;

    // Create a new order instance
    const order = new Order({
      user,
      orders: cart, // Assuming cart is structured correctly as per the schema
      totalPrice,
      roomNo,
      message: message ? message : "", // Added preferredSlot
      paymentType: paymentType || "", // Default to empty string if not provided
      orderTime: orderTime,
      assignedSlot: assignedSlot,
      priority: priority
    });
      
      await order.save();

      await mdpSystem.allocateOrders(order); // Allocate order dynamically

      res.json(order);
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
  }
});

// Update order status : PUT (private)
router.put("/orders/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.isAdmin) {
      const order = await Order.findOneAndUpdate(
        { _id: req.params.id },
        { isConfirmed: req.body.isConfirmed },
        { new: true }
      );
      res.json({ data: order });
    } else {
      return res.status(401).json({ msg: "You can't access this route" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// set payment type :  PUT (private)

router.put("/order/payment-type/:id", auth, async (req, res) => {
  try {
    const { paymentType } = req.body;

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { paymentType },
      { new: true }
    );

    res.json({ data: order });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Payment : PUT (private)
router.put("/payment-status/:id", auth, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { paymentStatus: true },
      { new: true }
    );

    res.json({ data: order });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
