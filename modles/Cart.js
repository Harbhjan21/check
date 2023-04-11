const mongoose = require("mongoose");
const { Schema } = mongoose;

const Addcart = new Schema({
  userid: { type: String },
  title: { type: String },
  rating: { type: String },
  price: { type: String },
  image: { type: String },
  discount: { type: String },
  stock: { type: String },
});

module.exports = mongoose.model("cart", Addcart);
