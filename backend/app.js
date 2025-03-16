require('dotenv').config();
const express = require("express");
const app = express();
const courseRouter = require("./routes/courseRouter");
const userRouter = require("./routes/userRouter");
const { unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route Handling
app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);

//  Error Handling Middleware
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;

