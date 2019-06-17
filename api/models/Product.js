const { Schema, model } = require("mongoose");

const Product = new Schema({
  name: String,
  quantity: Number,
  price: Number,
  expirationDate: Date,
  createdAt: Date,
  updatedAt: Date
});

module.exports = model("product", Product);
