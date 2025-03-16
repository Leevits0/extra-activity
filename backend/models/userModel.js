const mongoose = require("mongoose");


const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    address: { type: String, required: true },
    occupation: { type: String, required: true }
  }, { timestamps: true, versionKey: false });

  module.exports = mongoose.model("User", userSchema);