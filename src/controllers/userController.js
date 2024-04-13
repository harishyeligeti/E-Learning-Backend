const pool = require('../config/database');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const updatedUser = await pool.query(
      'UPDATE users SET name = $1, profile_picture = $2 WHERE id = $3 RETURNING *',
      [name, profilePicture, req.user.userId]
    );
    res.status(200).json(updatedUser.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};