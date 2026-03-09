const express = require("express");
const router = express.Router();

const {
  createStudent,
  getStudents
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createStudent);
router.get("/", authMiddleware, getStudents);

module.exports = router;