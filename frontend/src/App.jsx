import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// pages & components
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AddCoursePage from "./pages/AddCoursePage";
import CoursePage from "./pages/CoursePage";
import EditCoursePage from "./pages/EditCoursePage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <div className="content p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses/:id" element={<CoursePage isAuthenticated={isAuthenticated} />} />

            {/* Protected Routes */}
            <Route
              path="/courses/add-course"
              element={isAuthenticated ? <AddCoursePage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/edit-course/:id"
              element={isAuthenticated ? <EditCoursePage /> : <Navigate to="/signup" />}
            />

            {/* Authentication Routes */}
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />

            {/* Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
