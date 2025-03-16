const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("./app");
const api = supertest(app);
const User = require("../models/userModel");

beforeAll(async () => {
  await User.deleteMany({});
});

describe("User Routes", () => {
  describe("POST /api/users/signup", () => {
    it("should signup a new user with valid credentials", async () => {
      // Arrange
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Pass!#22w0d@",
        githubUsername: "john_doe",
        language: "JavaScript",
        website: "https://johndoe.dev",
        jobTitle: "Software Engineer",
      };

      // Act
      const result = await api.post("/api/users/signup").send(userData);

      // Assert
      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty("token");
      expect(result.body).toHaveProperty("email", "john@example.com");
      expect(result.body).toHaveProperty("githubUsername", "john_doe");
    });

    it("should return an error when missing required fields", async () => {
      // Arrange
      const incompleteUserData = {
        email: "incomplete@example.com",
        password: "Pass!#22w0d@", // Missing required fields
      };

      // Act
      const result = await api.post("/api/users/signup").send(incompleteUserData);

      // Assert
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });

    it("should return an error for weak password", async () => {
      // Arrange
      const weakPasswordUser = {
        name: "Weak Password User",
        email: "weakpass@example.com",
        password: "123456",
        githubUsername: "weak_user",
        language: "Python",
        website: "https://weakpass.com",
        jobTitle: "Data Analyst",
      };

      // Act
      const result = await api.post("/api/users/signup").send(weakPasswordUser);

      // Assert
      expect(result.status).toBe(400);
      expect(result.body.error).toContain("Password must be at least 8 characters");
    });

    it("should return an error when email is already registered", async () => {
      // Arrange
      const duplicateUser = {
        name: "John Doe",
        email: "john@example.com", // Same email as previous test
        password: "Pass!#22w0d@",
        githubUsername: "john_doe_2",
        language: "Java",
        website: "https://john_doe.com",
        jobTitle: "Backend Developer",
      };

      // Act
      const result = await api.post("/api/users/signup").send(duplicateUser);

      // Assert
      expect(result.status).toBe(400);
      expect(result.body.error).toBe("User already exists.");
    });
  });

  describe("POST /api/users/login", () => {
    it("✅ should login a user with valid credentials", async () => {
      const userData = {
        email: "john@example.com",
        password: "Pass!#22w0d@",
      };
  
      const result = await api.post("/api/users/login").send(userData);
  
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("token");
      expect(result.body).toHaveProperty("email", "john@example.com");
      expect(result.body).toHaveProperty("githubUsername");  // ✅ Fix: Ensure this exists
    });
  
    it("❌ should return 401 for invalid credentials", async () => {
      const userData = {
        email: "wrong@example.com",
        password: "invalidpassword",
      };
  
      const result = await api.post("/api/users/login").send(userData);
  
      expect(result.status).toBe(401);  // ✅ Fix: Expect 401 Unauthorized
      expect(result.body).toHaveProperty("error");
    });
  
    it("❌ should return 400 for missing password", async () => {
      const userData = {
        email: "john@example.com",
      };
  
      const result = await api.post("/api/users/login").send(userData);
  
      expect(result.status).toBe(400);  // ✅ Fix: Expect 400 Bad Request
      expect(result.body.error).toBe("Email and password are required.");
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
