require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const customMiddleware = require("../middleware/customMiddleware");
const bookRouter = require("../routers/bookRouter");
const userRouter = require("../routers/userRouter");

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use(customMiddleware.requestLogger);

app.get("/", (req, res) => res.send("API Running!"));

app.use("/api/books", bookRouter);
app.use("/api/users", userRouter);

app.use(customMiddleware.unknownEndpoint);
app.use(customMiddleware.errorHandler);

// connect to db
console.log('connecting to', process.env.MONGO_URI)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = app;