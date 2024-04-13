const pool = require('../config/database');

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    // Check if course exists
    const courseExists = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (courseExists.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled in the course
    const enrollmentExists = await pool.query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );
    if (enrollmentExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already enrolled in this course' });
    }

    // Create a new enrollment
    await pool.query('INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)', [userId, courseId]);

    res.status(201).json({ message: 'Enrollment successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get enrolled courses for a user
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.userId;

    const enrollments = await pool.query(
      'SELECT c.* FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE e.user_id = $1',
      [userId]
    );

    res.status(200).json(enrollments.rows);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};