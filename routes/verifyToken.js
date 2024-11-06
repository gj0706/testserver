const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
	const authHeader = req.headers.token;

	const token = authHeader.split(" ")[1];

	// CHECK IF WE EVEN HAVE A TOKEN
	if (!token) {
		res.status(401).json({
			errors: [
				{
					msg: "No token found",
				},
			],
		});
	}

	try {
		const user = await jwt.verify(token, process.env.JWT_SEC_KEY);
		req.user = user.email;
		next();
	} catch (error) {
		res.status(400).json({
			errors: [
				{
					msg: "Invalid Token",
				},
			],
		});
	}
};
