const { summarizeText } = require("../services/llmService");

exports.summarize = async (req, res) => {

  try {

    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Text is required" });
    }

    if (text.length < 50) {
      return res.status(400).json({ message: "Text too short (min 50 characters)" });
    }

    if (text.length > 10000) {
      return res.status(413).json({ message: "Text too long" });
    }

    const summary = await summarizeText(text);

    res.json({
      summary,
      model: "gemini-2.5-flash"
    });

  } catch (error) {

    res.status(502).json({
      message: "LLM service failed",
      error: error.message
    });

  }

};