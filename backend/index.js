require("dotenv").config();  // ✅ Ensure this is the FIRST import

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRouter = require("./routes/userRouter");
const courseRouter = require("./routes/courseRouter");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
// Connect to MongoDB
connectDB();

// Routes
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);

// Error Handling Middleware (if any)
const { unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
app.use(unknownEndpoint);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
