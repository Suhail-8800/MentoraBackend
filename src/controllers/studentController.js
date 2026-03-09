const pool = require("../config/db");

exports.createStudent = async (req, res) => {
  try {

    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can create students" });
    }

    const { name, age } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Student name is required" });
    }

    const student = await pool.query(
      "INSERT INTO students (name, age, parent_id) VALUES ($1,$2,$3) RETURNING *",
      [name, age, req.user.id]
    );

    res.status(201).json({
      message: "Student created successfully",
      student: student.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {

    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can view students" });
    }

    const students = await pool.query(
      "SELECT * FROM students WHERE parent_id=$1",
      [req.user.id]
    );

    res.json(students.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};