import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditCoursePage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  // State variables for form fields
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [fee, setFee] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;
  const navigate = useNavigate();

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch course");

        const data = await res.json();
        setCourse(data);

        // Populate form fields with existing data
        setTitle(data.title);
        setDuration(data.duration);
        setFee(data.fee);
        setInstructorName(data.instructor.name);
        setContactEmail(data.instructor.contactEmail);
        setContactPhone(data.instructor.contactPhone);
      } catch (error) {
        console.error("❌ Error fetching course:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, token]);

  // Update course details
  const updateCourse = async (updatedCourse) => {
    try {
      console.log("Updating course:", updatedCourse);
      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCourse),
      });

      if (!res.ok) throw new Error("Failed to update course");
      return true;
    } catch (error) {
      console.error("❌ Error updating course:", error);
      return false;
    }
  };

  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();

    const updatedCourse = {
      title,
      duration,
      fee: parseFloat(fee),
      instructor: {
        name: instructorName,
        contactEmail,
        contactPhone,
      },
    };

    const success = await updateCourse(updatedCourse);
    if (success) {
      console.log("✅ Course Updated Successfully");
      navigate(`/courses/${id}`);
    } else {
      console.error("❌ Failed to update the course");
    }
  };

  return (
    <div className="edit-course">
      <h2>Update Course</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <form onSubmit={submitForm} className="edit-course-form">
          <label>Course Title:</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />

          <label>Duration:</label>
          <input type="text" required value={duration} onChange={(e) => setDuration(e.target.value)} />

          <label>Fee:</label>
          <input type="number" required value={fee} onChange={(e) => setFee(e.target.value)} />

          <h3>Instructor Details</h3>

          <label>Name:</label>
          <input type="text" required value={instructorName} onChange={(e) => setInstructorName(e.target.value)} />

          <label>Contact Email:</label>
          <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />

          <label>Contact Phone:</label>
          <input type="text" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />

          <button type="submit">Update Course</button>
        </form>
      )}
    </div>
  );
};

export default EditCoursePage;
