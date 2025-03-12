const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({

  totalRevenue: { type: Number, default: 0 },
  member: { type: String, required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('Revenue', revenueSchema);


