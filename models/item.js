// backend/models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }, // jis user ka item hai
    title: { 
      type: String, 
      required: true, 
      trim: true 
    }, // item ka title
    description: { 
      type: String, 
      trim: true 
    }, // optional description
  }, 
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
