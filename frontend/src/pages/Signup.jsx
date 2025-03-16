import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const name = useField("text");
  const username = useField("text"); 
  const password = useField("password");
  const gender = useField("text");
  const dateOfBirth = useField("date");
  const address = useField("text");
  const occupation = useField("text");

  const { signup, error, isLoading } = useSignup("/api/users/signup");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsAuthenticated(true);  
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const response = await signup({
      name: name.value,
      username: username.value, 
      password: password.value,
      gender: gender.value,
      date_of_birth: dateOfBirth.value,
      address: address.value,
      occupation: occupation.value,
    });

    console.log("🔹 Response after signup:", response);

    if (response) {
      console.log("✅ Signup successful:", response);
      setIsAuthenticated(true); 
      navigate("/");
    } else {
      console.error("❌ Signup failed. Check error state.");
    }
  };

  return (
    <div className="create p-6 bg-white shadow-md rounded-md w-1/2 mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
        <label className="font-semibold">Name:</label>
        <input {...name} required className="border p-2 rounded-md" />

        <label className="font-semibold">Username:</label>
        <input {...username} required className="border p-2 rounded-md" />

        <label className="font-semibold">Password:</label>
        <input {...password} required className="border p-2 rounded-md" />

        <label className="font-semibold">Gender:</label>
        <input {...gender} required className="border p-2 rounded-md" />

        <label className="font-semibold">Date of Birth:</label>
        <input {...dateOfBirth} required className="border p-2 rounded-md" />

        <label className="font-semibold">Address:</label>
        <input {...address} required className="border p-2 rounded-md" />

        <label className="font-semibold">Occupation:</label>
        <input {...occupation} required className="border p-2 rounded-md" />

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" disabled={isLoading} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
