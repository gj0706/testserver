const mongoose = require("mongoose");

const ObjectID = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema(
	{
		userId: {
			// type: ObjectID,
			// ref: "User",
			type: String,
			required: true,
		},
		cartItems: [
			{
				id: {
					type: String,
					// type: ObjectID,
					// ref: "Product",
					required: true,
				},
				quantity: {
					type: String,
				},
				name: { type: String },
				price: { type: String },
				imageUrl: { type: String },
				// description: { type: String },
			},
		],
	},
	{ timestamps: true }
);

module.exports = cartSchema;
