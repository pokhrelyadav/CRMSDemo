const express = require("express");
const Food = require("../models/food.models");
const User = require("../models/auth.models");
const Recommend=require("../models/recommend.model")
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/cloudinary");
const { check, validationResult } = require("express-validator");

// additem : POST (private)
router.post(
  "/add",
  [
    auth,
    upload,
    [
      auth,
      check("name", "Food name is required").not().isEmpty(),
      check("foodType", "Food category is required").not().isEmpty(),
      check("price", "Food price is required").not().isEmpty(),
      check("quantity", "Qunatity is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      if (user.isAdmin) {
        const { foodType, name, price, description, quantity } = req.body;

        const food = new Food({
          foodType,
          name,
          price,
          description,
          quantity,
          image: req.file.path,
        });
        await food.save();
        res.json({ msg: "Added item successfully", food });
      } else {
        res.status(401).json({ msg: "You can't access this route" });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send(error.message);
    }
  }
);

// get single food item: GET (private)
router.get("/food-item/:id", auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    res.json(food);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

// get products
// router.get("/product/list", async (req, res) => {
//   const products = await Food.find();

//   return res.status(200).send({ message: "success", productList: products });
// });

router.get("/product/list", async (req, res) => {
  try {
    // Get the limit from query parameters, or default to 10
    const limit = parseInt(req.query.limit) || 10; // Default limit = 10

    // Fetch products with the applied limit
    const products = await Food.find().limit(limit);

    // console.log("Products Fetched from DB ydv:", products);

    return res.status(200).send({ message: "success", productList: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//get recommendation food

router.get("/recommend", async (req, res) => {
  try {
    // Get the limit from query parameters, or default to 10
    const limit = parseInt(req.query.limit) || 10; // Default limit = 10

    // Fetch products with the applied limit
    const products = await Recommend.find().limit(limit);


    return res.status(200).send({ message: "success", productList: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



// edit a food item : PUT(private)

router.put("/edit/:id", auth, upload, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.isAdmin) {
      var food = await Food.findById(req.params.id);

      const foodType = req.body.foodType ? req.body.foodType : food.foodType;
      const name = req.body.name ? req.body.name : food.name;
      const price = req.body.price ? req.body.price : food.price;
      const quantity = req.body.quantity ? req.body.quantity : food.quantity;
      const image = req.file ? req.file.path : food.image;

      food = await Food.findByIdAndUpdate(
        req.params.id,
        { foodType, name, price, quantity, image },
        { new: true }
      );
      res.json(food);
    } else {
      res.status(401).json({ msg: "You can't access this route" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// delete item: DELETE(private)
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.isAdmin) {
      const del = await Food.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted item successfully" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// search item : GET (private)

router.get("/search/:food", auth, async (req, res) => {
  try {
    const food = await Food.find({
      $match: { foodName: { $regex: req.params.food } },
    });
    res.json({ data: food });
  } catch (error) {
    res.status(500).json(errpr.message);
  }
});

// get item : GET (private)
router.get("/food/:food", auth, async (req, res) => {
  const food = req.params.food;
  try {
    const foods = await Food.find({ foodType: food });
    res.json({ data: foods });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

module.exports = router;
