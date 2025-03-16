import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";

const AddCoursePage = () => {
  //  Using `useField` for input fields
  const title = useField("text");
  const duration = useField("text");
  const fee = useField("number");
  const instructorName = useField("text");
  const contactEmail = useField("email");
  const contactPhone = useField("text");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;
  const navigate = useNavigate();

  const addCourse = async (newCourse) => {
    try {
      console.log("📚 Adding course:", newCourse);
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCourse),
      });

      if (!res.ok) {
        throw new Error("Failed to add course");
      }
      return true;
    } catch (error) {
      console.error("❌ Error adding course:", error);
      return false;
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const newCourse = {
      title: title.value,
      duration: duration.value,
      fee: parseFloat(fee.value), //  Convert to number
      instructor: {
        name: instructorName.value,
        contactEmail: contactEmail.value,
        contactPhone: contactPhone.value,
      },
    };

    const success = await addCourse(newCourse);
    if (success) {
      console.log("✅ Course Added Successfully");
      navigate("/");
    } else {
      console.error("❌ Failed to add the course");
    }
  };

  return (
    <div className="create p-6 bg-white shadow-md rounded-md w-1/2 mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Add a New Course</h2>
      <form onSubmit={submitForm} className="flex flex-col space-y-4">
        <label className="font-semibold">Course Title:</label>
        <input {...title} required className="border p-2 rounded-md" />

        <label className="font-semibold">Duration:</label>
        <input {...duration} required className="border p-2 rounded-md" />

        <label className="font-semibold">Fee:</label>
        <input {...fee} required className="border p-2 rounded-md" />

        <h3 className="text-lg font-semibold mt-4">Instructor Details</h3>

        <label className="font-semibold">Name:</label>
        <input {...instructorName} required className="border p-2 rounded-md" />

        <label className="font-semibold">Contact Email:</label>
        <input {...contactEmail} required className="border p-2 rounded-md" />

        <label className="font-semibold">Contact Phone:</label>
        <input {...contactPhone} required className="border p-2 rounded-md" />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCoursePage;
