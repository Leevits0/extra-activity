import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">My Courses</Link>
      
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/courses/add-course" className="navbar-link">Add Course</Link>
            <span className="navbar-user">{user?.username}</span>
            <button className="navbar-button" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/signup" className="navbar-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
