const express = require("express");
const router = express.Router();

const {
  createLesson,
  getLessons
} = require("../controllers/lessonController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createLesson);
router.get("/", getLessons);

module.exports = router;