const pool = require("../config/db");

exports.createSession = async (req, res) => {
  try {

    if (req.user.role !== "mentor") {
      return res.status(403).json({ message: "Only mentors can create sessions" });
    }

    const { lessonId, date, topic, summary } = req.body;

    if (!lessonId || !date) {
      return res.status(400).json({ message: "lessonId and date required" });
    }

    const session = await pool.query(
      "INSERT INTO sessions (lesson_id, date, topic, summary) VALUES ($1,$2,$3,$4) RETURNING *",
      [lessonId, date, topic, summary]
    );

    res.status(201).json({
      message: "Session created successfully",
      session: session.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLessonSessions = async (req, res) => {
  try {

    const lessonId = req.params.id;

    const sessions = await pool.query(
      "SELECT * FROM sessions WHERE lesson_id=$1",
      [lessonId]
    );

    res.json(sessions.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.joinSession = async (req, res) => {
  try {

    if (req.user.role !== "parent") {
      return res.status(403).json({
        message: "Only parents can register students for sessions"
      });
    }

    const sessionId = req.params.id;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({
        message: "studentId is required"
      });
    }

    // Check student belongs to parent
    const student = await pool.query(
      "SELECT * FROM students WHERE id=$1 AND parent_id=$2",
      [studentId, req.user.id]
    );

    if (student.rows.length === 0) {
      return res.status(403).json({
        message: "Student does not belong to this parent"
      });
    }

    const participant = await pool.query(
      "INSERT INTO session_participants (session_id, student_id) VALUES ($1,$2) RETURNING *",
      [sessionId, studentId]
    );

    res.status(201).json({
      message: "Student joined session successfully",
      data: participant.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to join session",
      error: error.message
    });
  }
};