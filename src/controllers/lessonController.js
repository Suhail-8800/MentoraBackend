const pool = require("../config/db");

exports.createLesson = async (req, res) => {
  try {

    if (req.user.role !== "mentor") {
      return res.status(403).json({ message: "Only mentors can create lessons" });
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const lesson = await pool.query(
      "INSERT INTO lessons (title, description, mentor_id) VALUES ($1,$2,$3) RETURNING *",
      [title, description, req.user.id]
    );

    res.status(201).json({
      message: "Lesson created successfully",
      lesson: lesson.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getLessons = async (req, res) => {
  try {

    const lessons = await pool.query(
      "SELECT * FROM lessons"
    );

    res.json(lessons.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};