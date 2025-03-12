const mongoose = require('mongoose');

const Userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },

    password: {
      type: String,
      required: true
    },

    gymname: {
      type: String,
      required: true,
      unique: true
    },

  }, { versionKey: false });
module.exports = mongoose.model('UserData', Userschema);