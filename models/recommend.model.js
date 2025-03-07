const mongoose = require('mongoose');
const RecommendSchema = new mongoose.Schema({
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
  image: {
    type: String,
    required: true,
  },
  quantity:{
    type:String,
    required: true
  
  },
  description: {
    type: String 
  }
});

module.exports = mongoose.model('recommend', RecommendSchema);
