//  const TimeSlot = require('../models/timeSlot.model');
const prompt = require("prompt-sync") ({sigint: true});
const MAX_ORDERS_PER_SLOT = 2; // Adjust as needed

// const Order = require('../models/order.models');
// class MDPSystem {
//   constructor(timeSlots, costs, maxCapacity) {
//     this.timeSlots = timeSlots;
//     this.costs = costs; // Dynamic costs: rejection, early service, and overtime
//     this.maxCapacity = maxCapacity;
//     this.slotCapacity = this.initializeSlotCapacity();
//     this.orders = []; // Store all orders for reallocation
//   }



//   // Convert time string (e.g., "6:00 AM") to minutes
//   convertToMinutes(time) {
//     if (typeof time !== "string") {
//       throw new TypeError(`Expected a string for time but received ${typeof time}`);
//     }

//     const [hour, minutePart] = time.split(":");
//     const [minute, period] = minutePart.split(" ");

//     let totalMinutes = parseInt(hour) * 60 + parseInt(minute);

//     if (period === "PM" && parseInt(hour) !== 12) totalMinutes += 12 * 60;
//     if (period === "AM" && parseInt(hour) === 12) totalMinutes -= 12 * 60;

//     return totalMinutes;
//   }

//   // Validate order data
//   validateOrder(order) {
//     if (
//       !order.user || //? made changes here customer id first
//       !order.orders ||
//       !order.orderTime 
//     ) {
//       throw new Error(`Invalid order data: ${JSON.stringify(order)}`);
//     }
//   }

//   // Check if a slot starts after the order's orderTime
//   isSlotValidForOrder(order, slot) {
//     const orderTime = this.convertToMinutes(order.orderTime);
//     const slotStartTime = this.convertToMinutes(slot.start);
//     return slotStartTime >= orderTime;
//   }

//   // Calculate priority score for an order
//   //! here the frequency, value and urgency should be passed from the orders

//   calculatePriority(order, weights) {
//     const frequency= 1;
//     const value = 9;
//     let urgency = prompt();
//     const timeFactor = this.convertToMinutes(order.orderTime);
//     const priorityScore = 
//        frequency * weights.w1 +
//        value * weights.w2 -
//       urgency * weights.w3 -
//         timeFactor * weights.w4;
    
//       // Log the calculated priority score
//       console.log('Calculated priority score:', priorityScore);
    
//      return priorityScore;
//   }

//   // Classify order as high or low priority
//   //! if the classtype is high or low given from the order
//   classifyOrder(order) {
//     return order.urgency > 5 ? "high" : "low";
//   }

//   // Check if a slot can accommodate an order
//   canAllocate(slot) {
//     const key = `${slot.start} - ${slot.end}`;
//     return this.slotCapacity.get(key) < this.maxCapacity;
//   }

//   // // Calculate dynamic cost for allocating an order to a slot
//   dynamicCost(order, slot) {
//     const key = `${slot.start} - ${slot.end}`;
//     if (!this.slotCapacity.has(key)) {
//       return this.costs.rejection; // Cost for invalid slot
//     }
//     if (!this.canAllocate(slot)) {
//       return this.costs.overtime; // Cost for exceeding capacity
//     }
//     // if (order.preferredSlot !== key) {
//     //   return this.costs.earlyService; // Cost for early service
//     // }//! removed 
//     return 0; // No additional cost
//   }

//   // // Update slot capacity when an order is prepared and picked up
//   // freeUpSlot(slotKey) {
//   //   if (this.slotCapacity.has(slotKey)) {
//   //     const currentCapacity = this.slotCapacity.get(slotKey);
//   //     if (currentCapacity > 0) {
//   //       this.slotCapacity.set(slotKey, currentCapacity - 1);
//   //       console.log(`Slot ${slotKey} capacity updated. Current capacity: ${currentCapacity - 1}`);
//   //       this.reallocatePendingOrders(); // Reallocate pending orders
//   //     }
//   //   } else {
//   //     throw new Error(`Invalid slot key: ${slotKey}`);
//   //   }
//   // }

//   // // Reallocate pending orders to vacant slots
//   // reallocatePendingOrders() {
//   //   const pendingOrders = this.orders.filter(
//   //     (order) => order.timeSlot === "Rejected" || order.timeSlot === "Pending"
//   //   );

//   //   for (const order of pendingOrders) {
//   //     let optimalSlot = null;
//   //     let minCost = Infinity;

//   //     // Find the slot with the minimum cost
//   //     for (const slot of this.timeSlots) {
//   //       // Check if the slot is valid for the order (starts after orderTime)
//   //       if (this.isSlotValidForOrder(order, slot)) {
//   //         const cost = this.dynamicCost(order, slot);
//   //         if (cost < minCost && this.canAllocate(slot)) {
//   //           minCost = cost;
//   //           optimalSlot = slot;
//   //         }
//   //       }
//   //     }

//   //     if (optimalSlot) {
//   //       const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
//   //       try {
//   //         this.updateSlotCapacity(slotKey, 1); // Increment capacity for allocated order
//   //         order.timeSlot = slotKey;
//   //         console.log(`Order ${order.id} reallocated to ${slotKey}`);
//   //       } catch (error) {
//   //         console.error(error.message);
//   //         order.timeSlot = "Rejected";
//   //       }
//   //     }
//   //   }
//   // }

//   // // Update slot capacity dynamically
//   updateSlotCapacity(slotKey, change) {
//     if (!this.slotCapacity.has(slotKey)) {
//       throw new Error(`Invalid slot key: ${slotKey}`);
//     }

//     const newCapacity = this.slotCapacity.get(slotKey) + change;

//     if (newCapacity < 0 || newCapacity > this.maxCapacity) {
//       throw new Error(`Capacity update for slot ${slotKey} exceeds limits.`);
//     }

//     this.slotCapacity.set(slotKey, newCapacity);
//   }

//   // // Allocate orders to time slots
//   // allocateOrders(orders) {
//   //   this.orders = orders; // Store orders for reallocation
//   //   const weights = { w1: 3, w2: 5, w3: 2, w4: 0.01 };

//   //   // Validate each order
//   //   for (const order of orders) {
//   //     this.validateOrder(order);
//   //     order.priority = this.calculatePriority(order, weights);
//   //     order.classType = this.classifyOrder(order);
//   //   }

//   //   // Validate time slots
//   //  //? deleted it
//   //  //! deleted the sorting of the orders
//   //   // // Sort orders by priority (descending)
//   //   orders.sort((a, b) => b.priority - a.priority);


//   //   for (const order of orders) {
//   //     let optimalSlot = null;
//   //     let minCost = Infinity;

//   //     // Find the slot with the minimum cost
//   //     for (const slot of this.timeSlots) {
//   //       // Check if the slot is valid for the order (starts after orderTime)
//   //       if (this.isSlotValidForOrder(order, slot)) {
//   //         const cost = this.dynamicCost(order, slot);
//   //         if (cost < minCost && this.canAllocate(slot)) {
//   //           minCost = cost;
//   //           optimalSlot = slot;
//   //         }
//   //       }
//   //     }

//   //     if (optimalSlot) {
//   //       const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
//   //       try {
//   //         this.updateSlotCapacity(slotKey, 1); // Increment capacity for allocated order
//   //         order.timeSlot = slotKey;
//   //       } catch (error) {
//   //         console.error(error.message);
//   //         order.timeSlot = "Pending"; // Mark as pending for reallocation
//   //       }
//   //     } else {
//   //       order.timeSlot = "Rejected";
//   //     }
//   //   }
//   // }
//   //? second dyanamic allocation
//   // Allocate orders to time slots
// // allocateOrders(orders) {
// //   this.orders = orders; // Store orders for reallocation
// //   const weights = { w1: 3, w2: 5, w3: 2, w4: 0.01 };

// //   // Validate each order and calculate priority
// //   for (const order of orders) {
// //       this.validateOrder(order);
// //       order.priority = this.calculatePriority(order, weights);
// //       order.classType = this.classifyOrder(order);
// //   }

// //   for (const order of orders) {
// //       let optimalSlot = null;
// //       let minCost = Infinity;

// //       // Check if the order has high urgency
// //       const isHighUrgency = order.urgency > 5; // Adjust the threshold as needed

// //       // Find the slot with the minimum cost
// //       for (const slot of this.timeSlots) {
// //           // Check if the slot is valid for the order (starts after orderTime)
// //           if (this.isSlotValidForOrder(order, slot)) {
// //               const cost = this.dynamicCost(order, slot);
// //               if (cost < minCost && this.canAllocate(slot)) {
// //                   minCost = cost;
// //                   optimalSlot = slot;
// //               }
// //           }
// //       }

// //       if (optimalSlot) {
// //           const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
// //           try {
// //               // If the order is high urgency, check for existing orders in the slot
// //               if (isHighUrgency) {
// //                   const existingOrders = this.orders.filter(o => o.assignedSlot === slotKey);
// //                   if (existingOrders.length > 0) {
// //                       // Reallocate existing orders based on their priority
// //                       for (const existingOrder of existingOrders) {
// //                           // Find a new slot for the existing order
// //                           let newSlot = null;
// //                           let newMinCost = Infinity;

// //                           for (const potentialSlot of this.timeSlots) {
// //                               if (this.isSlotValidForOrder(existingOrder, potentialSlot)) {
// //                                   const newCost = this.dynamicCost(existingOrder, potentialSlot);
// //                                   if (newCost < newMinCost && this.canAllocate(potentialSlot)) {
// //                                       newMinCost = newCost;
// //                                       newSlot = potentialSlot;
// //                                   }
// //                               }
// //                           }

// //                           // If a new slot is found, reallocate the existing order
// //                           if (newSlot) {
// //                               const newSlotKey = `${newSlot.start} - ${newSlot.end}`;
// //                               this.updateSlotCapacity(newSlotKey, 1); // Increment capacity for the new slot
// //                               existingOrder.assignedSlot = newSlotKey; // Update assigned slot
// //                               console.log(`Order ${existingOrder.id} reallocated to ${newSlotKey}`);
// //                           } else {
// //                               existingOrder.assignedSlot = "Rejected"; // No slot available
// //                           }
// //                       }
// //                   }
// //               }

// //               // Allocate the new order to the optimal slot
// //               this.updateSlotCapacity(slotKey, 1); // Increment capacity for allocated order
// //               order.assignedSlot = slotKey; // Assign the slot to the order
// //               console.log(`Order ${order.id} allocated to ${slotKey}`);
// //           } catch (error) {
// //               console.error(error.message);
// //               order.assignedSlot = "Pending"; // Mark as pending for reallocation
// //           }
// //       } else {
// //           order.assignedSlot = "Rejected"; // No slot available
// //       }
// //   }
// // }
// // ? 3rd allocation with loop and not being saved in the database
// //? also in loop but being saved in database due to order routes
// // Allocate orders to time slots
// // allocateOrders(orders) {
// //   this.orders = orders; // Store orders for reallocation
// //   const weights = { w1: 3, w2: 5, w3: 2, w4: 0.01 };

// //   // Validate each order and calculate priority
// //   for (const order of orders) {
// //       this.validateOrder(order);
// //       order.priority = this.calculatePriority(order, weights);
// //       order.classType = this.classifyOrder(order);
// //   }

// //   for (const order of orders) {
// //       let optimalSlot = null;
// //       let minCost = Infinity;

// //       // Check if the order has high urgency
// //       const isHighUrgency = order.urgency > 5; // Adjust the threshold as needed

// //       // Find the slot with the minimum cost
// //       for (const slot of this.timeSlots) {
// //           // Check if the slot is valid for the order (starts after orderTime)
// //           if (this.isSlotValidForOrder(order, slot)) {
// //               const cost = this.dynamicCost(order, slot);
// //               console.log(`Cost for order ${order.id} in slot ${slot.start} - ${slot.end}: ${cost}`);
// //               if (cost < minCost && this.canAllocate(slot)) {
// //                   minCost = cost;
// //                   optimalSlot = slot;
// //               }
// //           }
// //       }

// //       if (optimalSlot) {
// //           const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
// //           try {
// //               // If the order is high urgency, check for existing orders in the slot
// //               if (isHighUrgency) {
// //                   const existingOrders = this.orders.filter(o => o.assignedSlot === slotKey);
// //                   console.log(`Existing orders in slot ${slotKey}:`, existingOrders);

// //                   if (existingOrders.length > 0) {
// //                       // Reallocate existing orders based on their priority
// //                       for (const existingOrder of existingOrders) {
// //                           // Find a new slot for the existing order
// //                           let newSlot = null;
// //                           let newMinCost = Infinity;

// //                           for (const potentialSlot of this.timeSlots) {
// //                               if (this.isSlotValidForOrder(existingOrder, potentialSlot)) {
// //                                   const newCost = this.dynamicCost(existingOrder, potentialSlot);
// //                                   console.log(`Cost for existing order ${existingOrder.id} in potential slot ${potentialSlot.start} - ${potentialSlot.end}: ${newCost}`);
// //                                   if (newCost < newMinCost && this.canAllocate(potentialSlot)) {
// //                                       newMinCost = newCost;
// //                                       newSlot = potentialSlot;
// //                                   }
// //                               }
// //                           }

// //                           // If a new slot is found, reallocate the existing order
// //                           if (newSlot) {
// //                               const newSlotKey = `${newSlot.start} - ${newSlot.end}`;
// //                               this.updateSlotCapacity(newSlotKey, 1); // Increment capacity for the new slot
// //                               existingOrder.assignedSlot = newSlotKey; // Update assigned slot
// //                               console.log(`Order ${existingOrder.id} reallocated to ${newSlotKey}`);
// //                           } else {
// //                               existingOrder.assignedSlot = "Rejected"; // No slot available
// //                               console.log(`No available slot for existing order ${existingOrder.id}. Marked as Rejected.`);
// //                           }
// //                       }
// //                   }
// //               }

// //               // Allocate the new order to the optimal slot
// //               this.updateSlotCapacity(slotKey, 1); // Increment capacity for allocated order
// //               order.assignedSlot = slotKey; // Assign the slot to the order
// //               console.log(`Order ${order.id} allocated to ${slotKey}`);
// //           } catch (error) {
// //               console.error(error.message);
// //               order.assignedSlot = "Pending"; // Mark as pending for reallocation
// //           }
// //       } else {
// //           order.assignedSlot = "Rejected"; // No slot available
// // }
// //   }
// // }
// // Allocate orders to time slots
// //  async allocateOrders(orders) {
// //   this.orders = orders; // Store orders for reallocation
// //   const weights = { w1: 3, w2: 5, w3: 2, w4: 0.01 };

// //   // Validate each order and calculate priority
// //   for (const order of orders) {
// //       this.validateOrder(order);
// //       order.priority = this.calculatePriority(order, weights);
// //       order.classType = this.classifyOrder(order);
// //   }

// //   for (const order of orders) {
// //       let optimalSlot = null;
// //       let minCost = Infinity;

// //       // Find the slot with the minimum cost
// //       for (const slot of this.timeSlots) {
// //           // Check if the slot is valid for the order (starts after orderTime)
// //           if (this.isSlotValidForOrder(order, slot)) {
// //               const cost = this.dynamicCost(order, slot);
// //               if (cost < minCost && this.canAllocate(slot)) {
// //                   minCost = cost;
// //                   optimalSlot = slot;
// //               }
// //           }
// //       }

// //       if (optimalSlot) {
// //           const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
// //           const existingOrders = this.orders.filter(o => o.assignedSlot === slotKey);

// //           // Check if there are existing orders in the optimal slot
// //           if (existingOrders.length > 0) {
// //               // Compare priority scores
// //               for (const existingOrder of existingOrders) {
// //                   if (order.priority > existingOrder.priority) {
// //                       // Reallocate the existing order
// //                       let newSlot = null;
// //                       let newMinCost = Infinity;

// //                       // Find a new slot for the existing order
// //                       for (const potentialSlot of this.timeSlots) {
// //                           if (this.isSlotValidForOrder(existingOrder, potentialSlot)) {
// //                               const newCost = this.dynamicCost(existingOrder, potentialSlot);
// //                               if (newCost < newMinCost && this.canAllocate(potentialSlot)) {
// //                                   newMinCost = newCost;
// //                                   newSlot = potentialSlot;
// //                               }
// //                           }
// //                       }

// //                       // If a new slot is found, reallocate the existing order
// //                       if (newSlot) {
// //                           const newSlotKey = `${newSlot.start} - ${newSlot.end}`;
// //                           this.updateSlotCapacity(newSlotKey, 1); // Increment capacity for the new slot
// //                           existingOrder.assignedSlot = newSlotKey; // Update assigned slot

// //                           // Overwrite the existing order in the database
// //                           await Order.updateOne({ _id: existingOrder._id }, { assignedSlot: newSlotKey });
// //                           console.log(`Order ${existingOrder.id} reallocated to ${newSlotKey}`);
// //                       } else {
// //                           existingOrder.assignedSlot = "Rejected"; // No slot available
// //                           console.log(`No available slot for existing order ${existingOrder.id}. Marked as Rejected.`);
// //                       }
// //                   }
// //               }
// //           }

// //           // Allocate the new order to the optimal slot
// //           this.updateSlotCapacity(slotKey, 1); // Increment capacity for allocated order
// //           order.assignedSlot = slotKey; // Assign the slot to the order

// //           // Overwrite the new order in the database
// //           await order.updateOne({ _id: order._id }, { assignedSlot: slotKey });
// //           console.log(`Order ${order.id} allocated to ${slotKey}`);
// //       } else {
// //           order.assignedSlot = "Rejected"; // No slot available
// //       }
// //   }
// // }
// //? third try
// // findOptimalSlot(newOrder) {
// //   let optimalSlot = null;
// //   let minCost = Infinity;

// //   // Iterate through all available time slots
// //   for (const slot of this.timeSlots) {
// //       // Check if the slot is valid for the new order
// //       if (this.isSlotValidForOrder(newOrder, slot)) {
// //           const cost = this.dynamicCost(newOrder, slot); // Calculate the cost of assigning the order to this slot

// //           // Check if this slot has a lower cost than the current minimum
// //           if (cost < minCost && this.canAllocate(slot)) {
// //               minCost = cost; // Update the minimum cost
// //               optimalSlot = slot; // Update the optimal slot
// //           }
// //       }
// //   }

// //   return optimalSlot; // Return the best slot found, or null if none are valid
// // }
// // async reallocateOrders(newOrders) {
// //   const existingOrders = await Order.find({}); // Fetch existing orders from the database

// //   for (const newOrder of newOrders) {
// //       const optimalSlot = this.findOptimalSlot(newOrder); // Logic to find the best slot for the new order

// //       if (optimalSlot) {
// //           const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
// //           const conflictingOrders = existingOrders.filter(o => o.assignedSlot === slotKey);

// //           for (const existingOrder of conflictingOrders) {
// //               if (newOrder.priority > existingOrder.priority) {
// //                   const newSlot = this.findAlternativeSlot(existingOrder); // Logic to find a new slot for the existing order

// //                   if (newSlot) {
// //                       existingOrder.assignedSlot = `${newSlot.start} - ${newSlot.end}`;
// //                       await Order.updateOne({ _id: existingOrder._id }, { assignedSlot: existingOrder.assignedSlot });
// //                       console.log(`Order ${existingOrder.id} reallocated to ${existingOrder.assignedSlot}`);
// //                   } else {
// //                       existingOrder.assignedSlot = "Rejected"; // No slot available
// //                       await Order.updateOne({ _id: existingOrder._id }, { assignedSlot: existingOrder.assignedSlot });
// //                       console.log(`No available slot for existing order ${existingOrder.id}. Marked as Rejected.`);
// //                   }
// //               }
// //           }

// //           // Allocate the new order to the optimal slot
// //           newOrder.assignedSlot = slotKey;
// //           await Order.updateOne({ _id: newOrder._id }, { assignedSlot: newOrder.assignedSlot });
// //           console.log(`Order ${newOrder.id} allocated to ${slotKey}`);
// //       } else {
// //           newOrder.assignedSlot = "Rejected"; // No slot available
// //           await Order.updateOne({ _id: newOrder._id }, { assignedSlot: newOrder.assignedSlot });
// //       }
// //   }
// //}


// //? try again

// findOptimalSlot(order) {
//   let bestSlot = null;
//   let minCost = Infinity;

//   for (const slot of this.timeSlots) {
//       if (this.isSlotValidForOrder(order, slot)) {
//           const cost = this.dynamicCost(order, slot);
//           if (cost < minCost && this.canAllocate(slot)) {
//               minCost = cost;
//               bestSlot = slot;
//           }
//       }
//   }
//   return bestSlot;
// }

// findAlternativeSlot(order) {
//   let bestSlot = null;
//   let minCost = Infinity;

//   for (const slot of this.timeSlots) {
//       if (this.isSlotValidForOrder(order, slot) && this.canAllocate(slot)) {
//           const cost = this.dynamicCost(order, slot);
//           if (cost < minCost) {
//               minCost = cost;
//               bestSlot = slot;
//           }
//       }
//   }
//   return bestSlot;
// }


// async reallocateOrders(newOrders) {
//   const existingOrders = await Order.find({}); // Fetch all existing orders

//   for (const newOrder of newOrders) {
//       const optimalSlot = this.findOptimalSlot(newOrder); // Find best slot

//       if (optimalSlot) {
//           const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
//           const conflictingOrders = existingOrders.filter(o => o.assignedSlot === slotKey);

//           for (const existingOrder of conflictingOrders) {
//               if (newOrder.priority > existingOrder.priority) {
//                   const newSlot = this.findAlternativeSlot(existingOrder); // Find new slot

//                   if (newSlot) {
//                       existingOrder.assignedSlot = `${newSlot.start} - ${newSlot.end}`;
//                   } else {
//                       existingOrder.assignedSlot = "Rejected"; // Mark as rejected
//                   }

//                   await Order.updateOne({ _id: existingOrder._id }, { assignedSlot: existingOrder.assignedSlot });
//                   console.log(`Updated existing order ${existingOrder._id} -> ${existingOrder.assignedSlot}`);
//               }
//           }

//           newOrder.assignedSlot = slotKey;
//           await Order.updateOne({ _id: newOrder._id }, { assignedSlot: newOrder.assignedSlot });
//           console.log(`New order ${newOrder._id} allocated to ${slotKey}`);
//       } else {
//           newOrder.assignedSlot = "Rejected";
//           await Order.updateOne({ _id: newOrder._id }, { assignedSlot: newOrder.assignedSlot });
//       }
//   }
// }

//  }
 


// module.exports = MDPSystem;

const Order = require('../models/order.models');
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

class MDPSystem {
    constructor(timeSlots, costs, maxCapacity) {
        this.timeSlots = timeSlots;
        this.costs = costs; // Dynamic costs: rejection, early service, and overtime
        this.maxCapacity = maxCapacity;
        this.slotCapacity = this.initializeSlotCapacity();
    }

    // // Initialize slot capacities and validate buffer configurations
    // initializeSlotCapacity() {
    //     const timeSlotsMap = new Map();
    //     this.timeSlots.forEach(slot => {
    //         const key = `${slot.start} - ${slot.end}`;
    //         timeSlotsMap.set(key, 0); // Initialize slot capacity
    //     });
    //     return timeSlotsMap;
    // }
      // Initialize slot capacities and validate buffer configurations
  initializeSlotCapacity() {
    const timeSlotsMap = new Map();

    for (let i = 0; i < this.timeSlots.length; i++) {
      const currentSlot = this.timeSlots[i];
      const key = `${currentSlot.start} - ${currentSlot.end}`;

      // Validate buffer overlaps across all slots
      for (let j = i + 1; j < this.timeSlots.length; j++) {
        const nextSlot = this.timeSlots[j];
        if (
          this.convertToMinutes(currentSlot.end) + currentSlot.buffer >
          this.convertToMinutes(nextSlot.start)
        ) {
          throw new Error(
            `Invalid buffer configuration: Slot ${key} overlaps with slot ${nextSlot.start} - ${nextSlot.end}.`
          );
        }
      }

      timeSlotsMap.set(key, 0); // Initialize capacity to zero
    }

    return timeSlotsMap;
  }
    updateSlotCapacity(slotKey, change) {
    if (!this.slotCapacity.has(slotKey)) {
      throw new Error(`Invalid slot key: ${slotKey}`);
    }

    const newCapacity = this.slotCapacity.get(slotKey) + change;

    if (newCapacity < 0 || newCapacity > this.maxCapacity) {
      throw new Error(`Capacity update for slot ${slotKey} exceeds limits.`);
    }

    this.slotCapacity.set(slotKey, newCapacity);
  }

    // Convert time string (e.g., "6:00 AM") to minutes
    convertToMinutes(time) {
        const [hour, minutePart] = time.split(":");
        const [minute, period] = minutePart.split(" ");
        let totalMinutes = parseInt(hour) * 60 + parseInt(minute);
        if (period === "PM" && parseInt(hour) !== 12) totalMinutes += 12 * 60;
        if (period === "AM" && parseInt(hour) === 12) totalMinutes -= 12 * 60;
        return totalMinutes;
    }

    // Validate an order
    validateOrder(order) {
        if (!order.user || !order.orders || !order.orderTime) {
            throw new Error(`Invalid order data: ${JSON.stringify(order)}`);
        }
    }

    // Check if a slot starts after the order's orderTime
    isSlotValidForOrder(order, slot) {
        return this.convertToMinutes(slot.start) >= this.convertToMinutes(order.orderTime);
    }

    //! required from the retailer
    async getSlotCapacity() {
        const orders = await Order.find({});
        const slotCapacity = new Map();
        
        orders.forEach(order => {
            if (order.assignedSlot && order.assignedSlot !== "Rejected") {
                slotCapacity.set(order.assignedSlot, (slotCapacity.get(order.assignedSlot) || 0) + 1);
            }
        });
        
        return slotCapacity;
    }
    
    // Calculate priority score for an order
    calculatePriority(order) {
        const weights = { w1: 3, w2: 5, w3: 2, w4: 0.01 };
        const frequency = 1;
        const value = 100;
        let urgency = prompt();
       const ps =frequency * weights.w1 + value * weights.w2 - urgency * weights.w3 - this.convertToMinutes(order.orderTime) * weights.w4;
       console.log(ps);
       return ps;
    }

    // Find the best available slot for an order
    // findOptimalSlot(order) {
    //     let optimalSlot = null;
    //     let minCost = Infinity;
    //     for (const slot of this.timeSlots) {
    //         if (this.isSlotValidForOrder(order, slot) && this.canAllocate(slot)) {
    //             const cost = this.dynamicCost(order, slot);
    //             if (cost < minCost) {
    //                 minCost = cost;
    //                 optimalSlot = slot;
    //             }
    //         }
    //     }
        
    //     if (optimalSlot) {
    //                   const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
    //                   try {
    //                       // If the order is high urgency, check for existing orders in the slot
    //                       if (order.urgency<3) {
    //                         console.log("entered");
    //                           const existingOrders = this.orders.filter(o => o.assignedSlot === slotKey);
    //                           if (existingOrders.length > 0) {
    //                               // Reallocate existing orders based on their priority
    //                               for (const existingOrder of existingOrders) {
    //                                   // Find a new slot for the existing order
    //                                   let newSlot = null;
    //                                   let newMinCost = Infinity;
            
    //                                   for (const potentialSlot of this.timeSlots) {
    //                                       if (this.isSlotValidForOrder(existingOrder, potentialSlot)) {
    //                                           const newCost = this.dynamicCost(existingOrder, potentialSlot);
    //                                           if (newCost < newMinCost && this.canAllocate(potentialSlot)) {
    //                                               newMinCost = newCost;
    //                                               newSlot = potentialSlot;
    //                                           }
    //                                       }
    //                                   }
            
    //                                   //? If a new slot is found, reallocate the existing order
    //                                 //   if (newSlot) {
    //                                 //       const newSlotKey = `${newSlot.start} - ${newSlot.end}`;
    //                                 //       this.updateSlotCapacity(newSlotKey, 1); // Increment capacity for the new slot
    //                                 //       existingOrder.assignedSlot = newSlotKey; // Update assigned slot
    //                                 //       console.log(`Order ${existingOrder.id} reallocated to ${newSlotKey}`);
    //                                 //   } else {
    //                                 //       existingOrder.assignedSlot = "Rejected"; // No slot available
    //                                 //   }
    //                               }
    //                           }
    //                       }
            
    //                       // Allocate the new order to the optimal slot
    //                       this.updateSlotCapacity(slotKey, 1); // Increment capacity for allocated order
    //                       order.assignedSlot = slotKey; // Assign the slot to the order
    //                       console.log(`Order ${order.id} allocated to ${slotKey}`);
    //                   } catch (error) {
    //                       console.error(error.message);
    //                       order.assignedSlot = "Pending"; // Mark as pending for reallocation
    //                   }
    //               } else {
    //                   order.assignedSlot = "Rejected"; // No slot available
    //               }
    //               return optimalSlot;
    //           }
            
    

    // Check if a slot can accommodate an order
    canAllocate(slot) {
        const key = `${slot.start} - ${slot.end}`;
        return this.slotCapacity.get(key) < this.maxCapacity;
    }

    // Calculate the dynamic cost of assigning an order to a slot
    dynamicCost(order, slot) {
        const key = `${slot.start} - ${slot.end}`;
        if (!this.slotCapacity.has(key)) return this.costs.rejection;
        if (!this.canAllocate(slot)) return this.costs.overtime;
        return 0; // No additional cost
    }
    findOptimalSlot(order){
        const slotsArray = Object.values(timeSlots);
     // Filter slots where order time is beyond the slot time
  const validSlots = slotsArray.filter(slot => order.orderTime < slot.end);1

  // Sort slots based on nearest
 validSlots.sort((a, b) => Math.abs(order.time - a.start) - Math.abs(order.time - b.start));
console.log(validSlots[0]);
  return validSlots.length > 0 ? validSlots[0] : null;
    }
    findAlternativeSlot(order, optimalSlot) {
        const slotsArray = Object.values(timeSlots);
    
        // Filter slots where order time is beyond the slot time AND not the optimal slot
        const validSlots = slotsArray.filter(slot => 
            order.orderTime < slot.end && !(slot.start === optimalSlot.start && slot.end === optimalSlot.end)
        );
    
        // Sort by the nearest available slot
        validSlots.sort((a, b) => 
            Math.abs(order.orderTime - a.start) - Math.abs(order.orderTime - b.start)
        );
        console.log(validSlots[0]);
    
        return validSlots.length > 0 ? validSlots[0] : null;
    }
    
    // ! try for greater modification
    async allocateOrders(newOrder) {
        const existingOrders = await Order.find({});
        const slotCapacity = await this.getSlotCapacity(); // Get current slot usage
    
        if (newOrder) {
            newOrder.priority = this.calculatePriority(newOrder);
            const optimalSlot = this.findOptimalSlot(newOrder);
            
            if (optimalSlot) {
                const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
                newOrder.assignedSlot = slotKey;
                await Order.updateOne({ _id: newOrder._id }, { assignedSlot: slotKey });
    
                // Update slot capacity
                slotCapacity.set(slotKey, (slotCapacity.get(slotKey) || 0) + 1);
                
                // Find conflicting orders (including the new one)
                let conflictingOrders = existingOrders.filter(o => o.assignedSlot === slotKey);
                conflictingOrders.push(newOrder);
    
                // If slot exceeds max limit, reallocate the lowest-priority order
                if (slotCapacity.get(slotKey) > MAX_ORDERS_PER_SLOT) {
                    conflictingOrders.sort((a, b) => a.priority - b.priority); // Sort by priority (ascending)
    
                    while (slotCapacity.get(slotKey) > MAX_ORDERS_PER_SLOT) {
                        const lowestPriorityOrder = conflictingOrders.shift(); // Remove lowest-priority order
                        const newSlot = this.findAlternativeSlot(lowestPriorityOrder, optimalSlot);
    
                        if (newSlot) {
                            lowestPriorityOrder.assignedSlot = `${newSlot.start} - ${newSlot.end}`;
                            slotCapacity.set(lowestPriorityOrder.assignedSlot, (slotCapacity.get(lowestPriorityOrder.assignedSlot) || 0) + 1);
                        } else {
                            lowestPriorityOrder.assignedSlot = "Rejected";
                        }
    
                        await Order.updateOne({ _id: lowestPriorityOrder._id }, { assignedSlot: lowestPriorityOrder.assignedSlot });
                        slotCapacity.set(slotKey, slotCapacity.get(slotKey) - 1);
                    }
                }
    
                console.log(`New order ${newOrder._id} allocated to ${slotKey}, lower priority orders were adjusted.`);
            } else {
                newOrder.assignedSlot = "Rejected";
                await Order.updateOne({ _id: newOrder._id }, { assignedSlot: "Rejected" });
                console.log(`New order ${newOrder._id} rejected due to no available slots.`);
            }
        }
    }
    

    // !Allocate and reallocate orders dynamically
    // async reallocateOrders(newOrder) {
    //     const existingOrders = await Order.find({}); // Fetch all orders from the database
        
    //     if(newOrder) {
    //         this.validateOrder(newOrder);
    //         newOrder.priority = this.calculatePriority(newOrder);
            
    //         const optimalSlot = this.findOptimalSlot(newOrder);
    //         if (optimalSlot) {
    //             const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
    //             const conflictingOrders = existingOrders.filter(o => o.assignedSlot === slotKey);
                
    //             for (const existingOrder of conflictingOrders) {
    //                 existingOrder.priority = this.calculatePriority(existingOrder);
    //                 if (newOrder.priority > existingOrder.priority) {
    //                     const newSlot = this.findOptimalSlot(existingOrder);
    //                     existingOrder.assignedSlot = newSlot ? `${newSlot.start} - ${newSlot.end}` : "Rejected";
    //                     await Order.updateOne({ _id: existingOrder._id }, { assignedSlot: existingOrder.assignedSlot });
    //                 }
    //             }
                
    //             newOrder.assignedSlot = slotKey;
    //             await Order.updateOne({ _id: newOrder._id }, { assignedSlot: slotKey });
    //         } else {
    //             newOrder.assignedSlot = "Rejected";
    //             await Order.updateOne({ _id: newOrder._id }, { assignedSlot: "Rejected" });
    //         }
    //     }
    // }

    // ? again simple
//     async reallocateOrders(newOrder) {
//       let allOrders = await Order.find({}); // Fetch all orders from the database
//       allOrders.push(newOrder);

//       // Calculate priority for all orders and sort them in descending order
//       allOrders.forEach(order => order.priority = this.calculatePriority(order));
//       allOrders.sort((a, b) => b.priority - a.priority);

//       // Clear current allocations
//       this.slotCapacity = this.initializeSlotCapacity();
//       for (const order of allOrders) {
//           const optimalSlot = this.findOptimalSlot(order);
//           if (optimalSlot) {
//               const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
//               order.assignedSlot = slotKey;
//               this.slotCapacity.set(slotKey, (this.slotCapacity.get(slotKey) || 0) + 1);
//           } else {
//               order.assignedSlot = "Rejected";
//           }
//           await Order.updateOne({ _id: order._id }, { assignedSlot: order.assignedSlot });
//       }
//   }

// ?


//! still needed modification
    // async allocateOrders(newOrder) {
    //     const existingOrders = await Order.find({});

    //     if (newOrder) {
    //         newOrder.priority= this.calculatePriority(newOrder);
    //         const optimalSlot = this.findOptimalSlot(newOrder);
    //         console.log(optimalSlot);
    //         if (optimalSlot) {
    //             const slotKey = `${optimalSlot.start} - ${optimalSlot.end}`;
    //             const conflictingOrders = existingOrders.filter(o => o.assignedSlot === slotKey);
                
    //             for (const existingOrder of conflictingOrders) {

    //                 if (newOrder.priority > existingOrder.priority ){
    //                     const newSlot = this.findOptimalSlot(existingOrder);
    //                     console.log("finally");
                        
    //                     if (newSlot) {
    //                         existingOrder.assignedSlot = `${newSlot.start} - ${newSlot.end}`;
    //                         console.log("existingorder changed")
    //                     } else {
    //                         existingOrder.assignedSlot = "Rejected";
    //                     }
    //                     await Order.updateOne({ _id: existingOrder._id }, { assignedSlot: existingOrder.assignedSlot });
    //                 }
    //             }

    //             newOrder.assignedSlot = slotKey;
    //             await Order.updateOne({ _id: newOrder._id }, { assignedSlot: newOrder.assignedSlot });
    //             console.log("New order is assigned forcefully according to the urgency")
    //             console.log(JSON.stringify(Order));
    //             console.log(JSON.stringify([...existingOrders]));
    //         } else {
    //             newOrder.assignedSlot = "Rejected";
    //             await Order.updateOne({ _id: newOrder._id }, { assignedSlot: newOrder.assignedSlot });
    //         }
    //     }
    // }

    // async handleOrderAcceptance(orderId) {
    //     const order = await Order.findById(orderId);
    //     if (!order) return;

    //     const assignedSlot = order.assignedSlot;
    //     console.log(`Order ${orderId} accepted, locking slot: ${assignedSlot}`);
        
    //     // Fetch and reallocate orders in the same slot
    //     const affectedOrders = await Order.find({ assignedSlot });
    //     for (const affectedOrder of affectedOrders) {
    //         if (affectedOrder._id.toString() !== orderId) {
    //             const newSlot = this.findAlternativeSlot(affectedOrder);
                
    //             if (newSlot) {
    //                 affectedOrder.assignedSlot = `${newSlot.start} - ${newSlot.end}`;
    //             } else {
    //                 affectedOrder.assignedSlot = "Rejected";
    //             }
    //             await Order.updateOne({ _id: affectedOrder._id }, { assignedSlot: affectedOrder.assignedSlot });
    //         }
    //     }
    // }
    
   


}

module.exports = MDPSystem;
