const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app").default;
const User = require("../models/User.js").default;
const Expense = require("../models/Expense.js").default;

describe("Expense Management", () => {
  let token;
  let expenseId;

  beforeAll(async () => {
    // Clear users and expenses before tests
    await User.deleteMany({});
    await Expense.deleteMany({});

    // Register a new user
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      password: "password123",
    });

    // Log in the user to get a token
    const res = await request(app).post("/api/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    token = res.body.token;

    // Ensure token is obtained
    if (!token) {
      throw new Error("Failed to obtain authentication token");
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should add a new expense", async () => {
    const response = await request(app)
      .post("/api/expense")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Groceries",
        category: "Food",
        amount: 50,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.amount).toBe(50);

    expenseId = response.body._id;
  });

  test("should fetch all expenses", async () => {
    const response = await request(app)
      .get("/api/expense")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Optionally, you can check that the array contains the expense we added
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body.some(expense => expense._id === expenseId)).toBe(true);
  });

  test("should delete an expense", async () => {
    // Ensure we have an expense ID to delete
    expect(expenseId).toBeDefined();

    const response = await request(app)
      .delete(`/api/expense/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Expense deleted");

    // Verify that the expense no longer exists
    const fetchResponse = await request(app)
      .get("/api/expense")
      .set("Authorization", `Bearer ${token}`);
    expect(fetchResponse.statusCode).toBe(200);
    expect(fetchResponse.body.some(expense => expense._id === expenseId)).toBe(false);
  });
});