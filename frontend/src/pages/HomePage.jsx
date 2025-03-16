import { useEffect, useState } from "react";
import CourseListings from "../components/CourseListings";

const HomePage = () => {
  const [courses, setCourses] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) {
          throw new Error("Could not fetch the courses");
        }
        const data = await res.json();
        setIsPending(false);
        setCourses(data);
        setError(null);
      } catch (err) {
        setIsPending(false);
        setError(err.message);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="home p-6">
      {error && <div className="text-red-500">{error}</div>}
      {isPending && <div className="text-gray-700">Loading...</div>}
      {courses && <CourseListings courses={courses} />}
    </div>
  );
};

export default HomePage;
