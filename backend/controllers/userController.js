const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const signupUser = async (req, res) => {
  const { name, username, password, gender, date_of_birth, address, occupation } = req.body;

  try {
    // Check for missing required fields
    if (!name || !username || !password || !gender || !date_of_birth || !address || !occupation) {
      return res.status(400).json({ error: "All fields are required." });
    }

    //  Validate username uniqueness
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    //  Validate strong password
    if (!validator.isStrongPassword(password, { 
        minLength: 8, 
        minLowercase: 1, 
        minUppercase: 1, 
        minNumbers: 1, 
        minSymbols: 1 
    })) {
      return res.status(400).json({ 
        error: "Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character." 
      });
    }

    //  Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Create new user
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      gender,
      date_of_birth,
      address,
      occupation,
    });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        gender: user.gender,
        date_of_birth: user.date_of_birth,
        address: user.address,
        occupation: user.occupation,
        token,
      });
    } else {
      res.status(400).json({ error: "Invalid user data." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    //  Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    //  Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    //  Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    //  Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
      address: user.address,
      occupation: user.occupation,
      token,
    });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.address = req.body.address || user.address;
    user.occupation = req.body.occupation || user.occupation;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      gender: updatedUser.gender,
      date_of_birth: updatedUser.date_of_birth,
      address: updatedUser.address,
      occupation: updatedUser.occupation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
  updateUser,
  deleteUser,
};
