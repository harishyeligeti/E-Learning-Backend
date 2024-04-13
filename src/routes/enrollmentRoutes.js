const express = require('express');
const enrollmentController = require('../controllers/enrollmentController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/:courseId', auth, enrollmentController.enrollCourse);
router.get('/', auth, enrollmentController.getEnrolledCourses);

module.exports = router;