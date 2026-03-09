const express = require("express");
const router = express.Router();

const {
  createSession,
  getLessonSessions
} = require("../controllers/sessionController");

const authMiddleware = require("../middleware/authMiddleware");
const { joinSession } = require("../controllers/sessionController");

router.post("/", authMiddleware, createSession);
router.get("/lesson/:id", getLessonSessions);
router.post("/:id/join", authMiddleware, joinSession);

module.exports = router;