var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { v4: uuidv4 } = require("uuid");
// connect to database
const auth = require("./routes/auth");

const connectToMongoose = require("./database/connect");
const User = require("./database/userModel");
const Product = require("./database/productModel");
const Cart = require("./database/cartModel");
connectToMongoose();

const verifyToken = require("./routes/verifyToken");
var app = express();
const cors = require("cors");
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));
app.use("/auth", auth);
// app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});
// get all users
app.get("/getUsers", async (_, res) => {
	try {
		const usersData = await User.find({});
		const allUsers = usersData.map(({ email, id, password, type }) => {
			return { email, id, password, type };
		});
		res.json(allUsers);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.post("/getOneUser", async (req, res) => {
	try {
		const user = await User.findById(req.body.id);
		res.json(user);
	} catch {
		res.status(500).json({ message: error.message });
	}
});

// sign in
// app.post("/signin", async (req, res) => {
// 	if (req.body && req.body.email && req.body.password) {
// 		const email = req.body.email;
// 		const password = req.body.password;
// 		const queryResult = await User.findOne({ email });

// 		if (password === queryResult.password) {
// 			res.json({
// 				message: `You've successfully signed in with Email: ${req.body.email}`,
// 				data: queryResult,
// 			});
// 			return;
// 		} else {
// 			return res.json({
// 				message: "Email or password doesn't match",
// 				status: 400,
// 			});
// 		}
// 	}
// 	res.json({ message: "Failed to sign in" });
// });

// // sign up
// app.post("/signup", async (req, res) => {
// 	//happy path
// 	if (req.body && req.body.email && req.body.password && req.body.id) {
// 		try {
// 			const existUser = await User.findOne({ email: req.body.email });

// 			if (existUser) {
// 				res.status(400).json({ message: "User already exists" });
// 			}
// 			const user = new User({
// 				type: req.body.type,
// 				id: req.body.id,
// 				email: req.body.email,
// 				password: req.body.password,
// 			});

// 			const newUser = await user.save();
// 			if (user === newUser) {
// 				res.status(201).json({
// 					message: "Sign up succeed",
// 					newUser: {
// 						id: newUser.id,
// 						email: newUser.email,
// 					},
// 				});
// 				return;
// 			}
// 		} catch (error) {
// 			// error handling
// 			res.json({ message: "Failed to add a user", status: 400 });
// 		}
// 	}
// 	res.json({ message: "Failed to sign up" });
// });

// get all products
app.get("/getProducts", async (_, res) => {
	try {
		const productData = await Product.find({});

		res.json(productData);
	} catch (err) {
		console.log.error("something went wrong");
	}
});

// add a product
app.post("/addProduct", verifyToken, async (req, res) => {
	//happy path

	if (
		req.body &&
		req.body.id &&
		req.body.name &&
		req.body.description &&
		req.body.quantity &&
		req.body.price &&
		req.body.imageUrl
	) {
		const product = new Product({
			id: req.body.id,
			name: req.body.name,
			price: req.body.price,
			quantity: req.body.quantity,
			imageUrl: req.body.imageUrl,
			description: req.body.description,
		});
		try {
			const newProduct = await product.save();
			if (product === newProduct) {
				res.status(200).json({
					message: "Product added",
					newProduct: {
						id: newProduct.id,
						name: newProduct.name,
						price: newProduct.price,
						quantity: newProduct.quantity,
						imageUrl: newProduct.imageUrl,
						description: newProduct.description,
					},
				});
				return;
			}
		} catch (error) {
			res.status(400).json({ message: "Failed to sign up" });
		}
	}
});

app.get("/signout", (req, res) => {
	res.json("Successfully signedout");
});

// update product infomation
app.put("/updateProduct", verifyToken, async (req, res) => {
	try {
		if (req.body && req.body.id) {
			const id = req.body.id;
			const updatedData = req.body;
			const result = await Product.findOne({ id });
			const { modifiedCount } = await result.updateOne(updatedData);

			if (modifiedCount) {
				res
					.status(200)
					.json({ message: "Product update succeed", data: updatedData });
				return;
			}
		}
	} catch (error) {
		res.status(400).json({ message: "Product update failed" });
	}
});

// get all cart info from a user
app.get("/getCart/:id", verifyToken, async (req, res) => {
	const userId = req.params.id;
	try {
		const cart = await Cart.findOne({ userId });
		const cartItems = cart.cartItems;
		// if (cartItems.length > 0) {
		res.status(200).json(cartItems);
	} catch (error) {
		res.status(400).json(error);
	}
});

// create a new cart
app.post("/newCart/:id", async (req, res) => {
	const userId = req.params.id;
	const newCart = new Cart({
		userId: userId,
		cartItems: [],
	});
	try {
		const savedCart = await newCart.save();
		res.status(200).json(savedCart);
	} catch (err) {
		res.status(400).send(err);
	}
});

// update a cart

app.put("/updateCart/:id", verifyToken, async (req, res) => {
	const userId = req.params.id;
	const updatedData = req.body;
	try {
		const result = await Cart.findOne({ userId });
		const { modifiedCount } = await result.updateOne(updatedData);

		if (modifiedCount) {
			res.status(200).json({ message: "Cart update succeed", data: result });
			return;
		}
	} catch (err) {
		res.status(400).json(err);
	}
});

// delete a cart
app.delete("/deleteCart", async (req, res) => {
	const userId = req.body.userId;
	try {
		await Cart.findByIdAndDelete(userId);
		res.status(200).json("Cart has been deleted...");
	} catch (err) {
		res.status(400).json(err);
	}
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
