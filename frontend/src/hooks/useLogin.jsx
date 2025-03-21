import { useState } from "react";

export default function useLogin(url) {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (userData) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("🔹 Sending login request:", userData);

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            console.log("🔹 API Response:", data);

            if (!response.ok) {
                setError(data.error || "Login failed");
                setIsLoading(false);
                return null;  // ✅ Return `null` on failure
            }

            // Store only necessary user data (excluding password)
            const { token, ...userDetails } = data;
            localStorage.setItem("user", JSON.stringify({ ...userDetails, token }));

            setIsLoading(false);
            return data;  // Return user data on success
        } catch (err) {
            console.error("❌ Network or Server Error:", err);
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
            return null;
        }
    };

    return { login, isLoading, error };
}
