//  const TimeSlot = require('../models/timeSlot.model');
const prompt = require("prompt-sync") ({sigint: true});
const MAX_ORDERS_PER_SLOT = 2; // Adjust as needed
const Ord = require('../models/order.models');



//   // Calculate priority score for an order
//   //! here the frequency, value and urgency should be passed from the orders
    


//   // Classify order as high or low priority
//   //! if the classtype is high or low given from the order
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
    constructor(timeSlots, maxCapacity) {
        this.timeSlots = timeSlots;
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
     async calculatePriority(order) {
        const weights = { w1: 3, w2: 5, w3: 2, w4: 0.01 };
        const frequency = await Ord.calculateFrequency(order.userId);
        console.log(frequency);
        const value = order.totalPrice; // Logarithmic scaling
        const urgency = order.urgency === "high" ? 1 : 10;

       const ps =frequency * weights.w1 + value * weights.w2 - urgency * weights.w3 - this.convertToMinutes(order.orderTime) * weights.w4;
       console.log(ps);
       console.log(order.totalPrice);
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
                await Order.updateOne({ _id: newOrder._id }, { assignedSlot: slotKey , priority : newOrder.priority});
    
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
    

    
   


}

module.exports = MDPSystem;
