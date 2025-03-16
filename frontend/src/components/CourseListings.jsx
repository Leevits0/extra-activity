import { Link } from "react-router-dom";

const CourseListings = ({ courses }) => {
  return (
    <div className="course-list">
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        courses.map((course) => (
          <div className="course-preview border p-4 rounded-lg shadow-md mb-4" key={course._id}>
            <Link to={`/courses/${course._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
              <h2>{course.title}</h2>
            </Link>
            <p><strong>Duration:</strong> {course.duration}</p>
            <p><strong>Fee:</strong> ${course.fee}</p>
            <p><strong>Instructor:</strong> {course.instructor?.name}</p>
            <p><strong>Contact Email:</strong> {course.instructor?.contactEmail}</p>
            <p><strong>Contact Phone:</strong> {course.instructor?.contactPhone}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseListings;
