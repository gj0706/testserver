const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		quantity: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = productSchema;
