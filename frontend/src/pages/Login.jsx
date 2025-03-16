import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const username = useField("text"); 
  const password = useField("password");
  const { login, error } = useLogin("/api/users/login");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {// Ensures UI updates immediately when user logs in
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const response = await login({ username: username.value, password: password.value });

    if (response) {
      console.log("✅ Login successful");
      setIsAuthenticated(true); 
      navigate("/");
    } else {
      console.error("❌ Login failed");
    }
  };

  return (
    <div className="create p-6 bg-white shadow-md rounded-md w-1/2 mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
        <label className="font-semibold">Username:</label>
        <input {...username} required className="border p-2 rounded-md" />

        <label className="font-semibold">Password:</label>
        <input {...password} required className="border p-2 rounded-md" />

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
