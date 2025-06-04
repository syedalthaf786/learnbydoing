const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/CourseController');

// GET all courses
router.get('/', CourseController.getCourses);

// POST a new course
router.post('/', CourseController.createCourse);

// GET course detail
router.get('/:courseId/detail', CourseController.getCourseDetail);

// GET course content
router.get('/:courseId/content', CourseController.getCourseContent);

// PUT update course
router.put('/:courseId', CourseController.updateCourse);

// DELETE course
router.delete('/:courseId', CourseController.deleteCourse);

module.exports = router;