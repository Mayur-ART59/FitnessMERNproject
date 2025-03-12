const mongoose = require('mongoose');

const Memberschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    plan: {
      type: String,
      required: true
    },
    joinDate: {
      type: String,
      required: true,
    },
    planPrice: {
      type: Number,
      required: true,
    },
    nextDueDate: {
      type: String,
      required: true,
    },
    renewalDate: {
      type: String
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },

  }, { versionKey: false });
module.exports = mongoose.model('Members', Memberschema);