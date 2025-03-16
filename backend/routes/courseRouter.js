const express = require('express');
const router = express.Router();
const { getAllCourses, createCourse, getCourseById, deleteCourse, updateCourse } = require('../controllers/courseController');
const requireAuth = require('../middleware/requireAuth');

// GET all Courses (Public)
router.get('/', getAllCourses);

// GET a single Course (Public)
router.get('/:id', getCourseById);

// Require authentication for the following routes
router.use(requireAuth);

// POST a new Course (Protected)
router.post('/', createCourse);

// DELETE a Course (Protected)
router.delete('/:id', deleteCourse);

// UPDATE a Course using PUT (Protected)
router.put('/:id', updateCourse);

module.exports = router;
