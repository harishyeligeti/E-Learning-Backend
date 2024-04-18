const pool = require("../config/database");
const paginationUtil = require("../utils/pagination");

// Get courses with filtering and pagination
exports.getCourses = async (req, res) => {
  try {
    const { category, level } = req.query;

    //show default page from 1 to 10
    const page = req.query.page ? parseInt(req.query.page, 10 ): 1
    const limit = req.query.limit ? parseInt(req.query.limit,10) : 10

    const filters = [];
    const values = [];

    if (category) {
      filters.push("category = $1");
      values.push(category);
    }

    if (level) {
      filters.push("level = $2");
      values.push(level);
    }

    const filterCondition = filters.join(" AND ");

    const { startIndex, endIndex, totalPages } = await paginationUtil.getPaginationData(page, limit, "courses", filterCondition, values);

    const courses = await pool.query(
      `SELECT * FROM courses ${filterCondition ? `WHERE ${filterCondition}` : ""}
       ORDER BY id ASC
       LIMIT $${filters.length + 1} OFFSET $${filters.length + 2}`,
      [...values, limit, startIndex]
    );

    res.status(200).json({
      courses: courses.rows,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new course (superadmin only)
exports.createCourse = async (req, res) => {
  try {
    // Check if user is superadmin
    const user = await pool.query("SELECT role FROM users WHERE id = $1", [req.user.userId]);
    if (user.rows[0].role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, description, category, level } = req.body;
    const newCourse = await pool.query("INSERT INTO courses (title, description, category, level) VALUES ($1, $2, $3, $4) RETURNING *", [title, description, category, level]);

    console.log("course created successfully");
    res.status(201).json(newCourse.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a course (superadmin only)
exports.updateCourse = async (req, res) => {
  try {
    // Check if user is superadmin
    const user = await pool.query("SELECT role FROM users WHERE id = $1", [req.user.userId]);
    if (user.rows[0].role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { courseId } = req.params;
    const { title, description, category, level } = req.body;

    // Check if course exists
    const courseExists = await pool.query("SELECT * FROM courses WHERE id = $1", [courseId]);
    if (courseExists.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updatedCourse = await pool.query("UPDATE courses SET title = $1, description = $2, category = $3, level = $4 WHERE id = $5 RETURNING *", [title, description, category, level, courseId]);

    console.log("course updated successfully");
    res.status(200).json(updatedCourse.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a course (superadmin only)
exports.deleteCourse = async (req, res) => {
  try {
    // Check if user is superadmin
    const user = await pool.query("SELECT role FROM users WHERE id = $1", [req.user.userId]);
    if (user.rows[0].role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { courseId } = req.params;

    // Check if course exists
    const courseExists = await pool.query("SELECT * FROM courses WHERE id = $1", [courseId]);
    if (courseExists.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete the course
    await pool.query("DELETE FROM courses WHERE id = $1", [courseId]);

    console.log("course deleted successfully");
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
