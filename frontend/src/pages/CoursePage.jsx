import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const CoursePage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const deleteCourse = async (id) => {
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete course: ${errorText}`);
      }
      console.log("✅ Course deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("❌ Error deleting course:", error);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const onDeleteClick = (courseId) => {
    const confirm = window.confirm(
      `Are you sure you want to delete course ID: ${courseId}?`
    );
    if (!confirm) return;

    deleteCourse(courseId);
  };

  return (
    <div className="course-preview p-6 bg-white shadow-md rounded-md w-2/3 mx-auto mt-6">
      {loading ? (
        <p className="text-gray-700">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
          <p><strong>Duration:</strong> {course.duration}</p>
          <p><strong>Fee:</strong> ${course.fee}</p>

          <h3 className="text-lg font-semibold mt-4">Instructor Details</h3>
          <p><strong>Name:</strong> {course.instructor?.name}</p>
          <p><strong>Contact Email:</strong> {course.instructor?.contactEmail}</p>
          <p><strong>Contact Phone:</strong> {course.instructor?.contactPhone}</p>

          {isAuthenticated && (
            <div className="mt-4">
              <button 
                onClick={() => onDeleteClick(course._id)} 
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button 
                onClick={() => navigate(`/edit-course/${course._id}`)} 
                className="bg-blue-500 text-white p-2 rounded-md ml-2 hover:bg-blue-600 transition"
              >
                Edit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursePage;
