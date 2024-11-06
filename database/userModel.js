const mongoose = require("mongoose");
const userSchema = require("./userSchema");
const collectionName = "users";
const User = mongoose.model("User", userSchema, collectionName);

module.exports = User;
