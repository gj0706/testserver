const router = require("express").Router();
const User = require("../database/userModel");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();
console.log(".env variables:", process.env);
router.post(
	"/signUp",
	[
		check("email", "Please input a valid email").isEmail(),
		check(
			"password",
			"Please input a password with a min length of 6"
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const { email, password, id, type } = req.body;

		// Validate the inputs
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({
				errors: errors.array(),
			});
		}
		try {
			const existUser = await User.findOne({ email: email });

			if (existUser) {
				return res.status(400).json({
					errors: [
						{
							msg: "This user already exists",
						},
					],
				});
			}

			// hash the password
			const hashedPassword = await bcrypt.hash(password, 10);
			console.log(hashedPassword);
			// save the password into database
			const user = new User({
				type: type,
				id: id,
				email: email,
				password: hashedPassword,
			});

			const newUser = await user.save();
			const token = await JWT.sign(
				{ email: email, type: type },
				process.env.JWT_SEC_KEY,
				{
					expiresIn: "3d",
				}
			);
			if (user === newUser) {
				res.status(200).json({
					message: "Sign up succeed",
					newUser: {
						id: newUser.id,
						email: newUser.email,
					},
					token: token,
				});
				return;
			}
		} catch (error) {
			// error handling
			res.json({ message: "Failed to add a user", status: 400 });
		}

		// res.json({ message: "Failed to sign up" });
	}
);

router.post("/signIn", async (req, res) => {
	const { email, password } = req.body;
	console.log(email, password);
	try {
		const user = await User.findOne({ email });
		console.log("user:", user);
		// Check if user with email exists
		if (!user) {
			return res.status(400).json({
				errors: [
					{
						msg: "Invalid Credentials",
					},
				],
			});
		}
		console.log("password:", password);
		console.log("user.password:", user.password);

		// Check if the password is valid
		let isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(404).json({
				errors: [
					{
						msg: "Invalid Credentials",
					},
				],
			});
		}
		//send json web token
		const token = JWT.sign({ email: email }, process.env.JWT_SEC_KEY, {
			expiresIn: "30d",
		});
		console.log("token:", token);
		res.json({
			message: "Sign in succeed",
			data: { id: user.id, type: user.type },
			token: token,
		});
		return;
	} catch (error) {
		res.status(400).json(error);
	}
});

module.exports = router;
