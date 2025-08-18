 const express = require("express");
  const router = express.Router();
 const User = require("../models/User");
  const bcrypt = require("bcryptjs");

 // Register
// // Login
// module.exports = router;


const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Check if Authorization header exists and extract token
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save decoded payload (e.g., { userId: "..." }) in request object
    req.user = decoded;

    // Continue to next middleware/route
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

 router.post("/register", async (req, res) => {
   try {
    const { name, email, password } = req.body;

     const userExist = await User.findOne({ email });
     if (userExist) return res.status(400).json({ message: "User already exists" });

     const hashedPassword = await bcrypt.hash(password, 10);
     const newUser = new User({ name, email, password: hashedPassword });
          await newUser.save();

  res.status(201).json({ message: "Registered successfully" });
   } catch (err) {
     res.status(500).json({ message: "Registration failed" });
   }
 });
 router.post("/login", async (req, res) => {
   try {
     const { email, password } = req.body;

     const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

     const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

     res.json({ token, userId: user._id, name: user.name });
  } catch (err) {
     res.status(500).json({ message: "Login failed" });
   }
 });



module.exports = router;
