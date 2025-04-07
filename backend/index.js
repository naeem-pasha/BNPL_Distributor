const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectToDatabase = require("./utils/connectDB");
const requestRoute = require("./Routes/request.route");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5004;

connectToDatabase();

const allowedOrigins = [
  "http://localhost:5173", // Vite frontend
  "http://localhost:5174/", // Another allowed domain
];
// Middleware
app.use(
  cors({
    origin: true,
    credentials: true, // Important for sending cookies along with requests (if using authentication via cookies)
  })
); // Enable CORS for all routes
app.use(morgan("dev")); // Logger middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser());

// Routes

app.use("/api", requestRoute);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy" });
});

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Server is http://localhost:${PORT}                       =========== Distributer =========== `
  );
});
