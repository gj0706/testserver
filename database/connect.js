const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const connectionStr =
	"mongodb+srv://gj0706:FNr8NnPWyoIJ0Sp2@product-management.hrzhi.mongodb.net/?retryWrites=true&w=majority&appName=product-management";
console.log("Connection string:", connectionStr); // For debugging

const connectToMongoose = async () => {
	if (!connectionStr) {
		console.error("MONGO_URL is not defined in the environment variables");
		process.exit(1);
	}

	try {
		await mongoose.connect(connectionStr, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

module.exports = connectToMongoose;
