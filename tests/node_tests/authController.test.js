const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../../models/User.js").default; 
const app = require("../../app").default;

describe("User Authentication", () => {
  
  beforeEach(async () => {
    await User.deleteMany({});
  });      

  test("should register a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123"
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
  });

  test("should login an existing user", async () => {
    // Create the user first
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123"
    });

    // Attempt to log in
    const response = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

});

afterAll(async () => {
    await mongoose.connection.close();
  });