import { useState } from "react";

export default function useSignup(url) {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const signup = async (userData) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("🔹 Sending signup request:", userData);

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            console.log("🔹 API Response:", data);

            if (!response.ok) {
                setError(data.error || "Signup failed");
                setIsLoading(false);
                return null;  // Return `null` only when an error occurs
            }

            // Store only necessary user data (excluding password)
            const { token, ...userDetails } = data;
            localStorage.setItem("user", JSON.stringify({ ...userDetails, token }));

            setIsLoading(false);
            return data;  // Return `data` when signup succeeds
        } catch (err) {
            console.error("❌ Network or Server Error:", err);
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
            return null;
        }
    };

    return { signup, isLoading, error };
}
