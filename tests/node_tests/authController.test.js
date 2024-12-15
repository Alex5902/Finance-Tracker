import mongoose from 'mongoose';
import { registerUser, loginUser } from '../../controllers/authController.js';
import User from '../../models/User.js';

jest.setTimeout(30000);

describe("User Authentication (Lambda Style)", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.dropDatabase(); // ensure no duplicates
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should register a new user", async () => {
    const registerEvent = {
      body: JSON.stringify({ username: "testuser", password: "password123" })
    };
    const regResponse = await registerUser(registerEvent);
    expect(regResponse.statusCode).toBe(201);
  });

  test("should login an existing user", async () => {
    const loginEvent = {
      body: JSON.stringify({ username: "testuser", password: "password123" })
    };
    const loginResponse = await loginUser(loginEvent);
    expect(loginResponse.statusCode).toBe(200);
    const body = JSON.parse(loginResponse.body);
    expect(body).toHaveProperty('token');
  });
});
