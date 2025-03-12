const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true, 
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },
},{versionKey:false}, {
  timestamps: true 
});

module.exports  = mongoose.model('Plan', planSchema);


