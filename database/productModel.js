const mongoose = require("mongoose");
const productSchema = require("./productSchema");
const collectionName = "products";

const Product = mongoose.model("Product", productSchema, collectionName);

module.exports = Product;
