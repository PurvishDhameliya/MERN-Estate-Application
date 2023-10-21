const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const connectDB = require("./config/connectDB");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const listingRoute = require("./routes/listingRoute");

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
connectDB();
const PORT = process.env.PORT || 8080;

mongoose.connection.on("open", () => {
  app.listen(PORT, () => {
    console.log(`Successfully running on ${PORT}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(`MongoDB connection error: ${error.message}`);
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/listing", listingRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
