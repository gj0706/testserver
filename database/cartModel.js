const mongoose = require("mongoose");
const cartSchema = require("./cartSchema");
const collectionName = "carts";

const Cart = mongoose.model("Cart", cartSchema, collectionName);

module.exports = Cart;
