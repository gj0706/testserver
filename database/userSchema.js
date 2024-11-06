const mongoose = require("mongoose");

// mongodb => setup schema => setup model => use model to query and update entity in the database

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		// cartItems: {
		// 	type: Array,
		// 	default: [],
		// },
	},
	{ tiimestamps: true }
);

module.exports = userSchema;
