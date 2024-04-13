const express = require('express');
const courseController = require('../controllers/courseController');
const auth = require('../middlewares/auth');
const roles = require('../middlewares/roles');

const router = express.Router();

router.get('/', courseController.getCourses);
router.post('/', auth, roles.isSuperadmin, courseController.createCourse);
router.put('/:courseId', auth, roles.isSuperadmin, courseController.updateCourse);
router.delete('/:courseId', auth, roles.isSuperadmin, courseController.deleteCourse);

module.exports = router;