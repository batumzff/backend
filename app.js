const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { errorHandler } = require("./utils/errorHandler");
const connectDB = require("./config/db");
const seedDb = require("./config/seeder");
// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// Seed database if not already seeded
seedDb();

// Route files
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Create Express app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handler middleware (should be after all routes)
app.use(errorHandler);

// For local development
if (!process.env.VERCEL_ENV) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
