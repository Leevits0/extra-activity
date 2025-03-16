const mongoose = require('mongoose');
const Course = require('../models/courseModel');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error("❌ Server Error in getAllCourses:", error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Public
const createCourse = async (req, res) => {
  try {
    const { title, duration, fee, instructor } = req.body;

    // ✅ Validate required fields
    if (!title || !duration || !fee || !instructor?.name || !instructor?.contactEmail || !instructor?.contactPhone) {
      return res.status(400).json({ error: "All required fields must be provided." });
    }

    const newCourse = new Course({
      title,
      duration,
      fee,
      instructor: {
        name: instructor.name,
        contactEmail: instructor.contactEmail,
        contactPhone: instructor.contactPhone,
      },
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("❌ Server Error in createCourse:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};


const getCourseById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such course found' });
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("❌ Server Error in getCourseById:", error);
    res.status(500).json({ error: 'Server Error' });
  }
};


const deleteCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid course ID" });
  }

  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(204).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error("❌ Server Error in deleteCourse:", error);
    res.status(500).json({ error: 'Server Error' });
  }
};


const updateCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid course ID" });
  }

  try {
    const course = await Course.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error("❌ Server Error in updateCourse:", error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getAllCourses,
  createCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
};
