const pool = require('../config/database');

const isSuperadmin = async (req, res, next) => {
  try {
    const user = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.userId]);
    if (user.rows[0].role !== 'superadmin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  isSuperadmin,
};