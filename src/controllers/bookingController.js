const pool = require("../config/db");

exports.createBooking = async (req, res) => {
  try {

    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can create bookings" });
    }

    const { studentId, lessonId } = req.body;

    if (!studentId || !lessonId) {
      return res.status(400).json({ message: "studentId and lessonId required" });
    }

    // check if student belongs to parent
    const student = await pool.query(
      "SELECT * FROM students WHERE id=$1 AND parent_id=$2",
      [studentId, req.user.id]
    );

    if (student.rows.length === 0) {
      return res.status(403).json({ message: "Student does not belong to this parent" });
    }

    const booking = await pool.query(
      "INSERT INTO bookings (student_id, lesson_id) VALUES ($1,$2) RETURNING *",
      [studentId, lessonId]
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking: booking.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};