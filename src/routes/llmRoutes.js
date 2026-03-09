const express = require("express");
const router = express.Router();

const { summarize } = require("../controllers/llmController");
const llmLimiter = require("../middleware/rateLimiter");

router.post("/summarize", summarize);

module.exports = router;