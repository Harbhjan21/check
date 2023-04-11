const mongoose = require("mongoose");

const { Schema } = mongoose;

const user = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  PhoneNo: { type: String, required: true },
});

const newuser = mongoose.model("user", user);

module.exports = newuser;
