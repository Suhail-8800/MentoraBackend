const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const lessonRoutes = require("./src/routes/lessonRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");
const llmRoutes = require("./src/routes/llmRoutes");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/lessons", lessonRoutes);
app.use("/bookings", bookingRoutes);
app.use("/sessions", sessionRoutes);
app.use("/llm", llmRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Mentora Backend Running 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "mentora-backend",
    time: new Date()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});