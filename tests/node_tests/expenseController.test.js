import mongoose from "mongoose";
import User from "../../models/User.js";
import Expense from "../../models/Expense.js";
import { registerUser, loginUser } from "../../controllers/authController.js";
import { addExpense, getExpense, deleteExpense } from "../../controllers/expenseController.js";

jest.setTimeout(30000);

describe("Expense Management (Lambda Style)", () => {
  let token;
  let userId;
  let expenseId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.dropDatabase();

    // Register a new user different from authController.test.js
    const registerEvent = {
      body: JSON.stringify({
        username: "testuser_expense",
        password: "password123"
      })
    };
    const regResponse = await registerUser(registerEvent);
    expect(regResponse.statusCode).toBe(201);

    // Login the user to get a token
    const loginEvent = {
      body: JSON.stringify({
        username: "testuser_expense",
        password: "password123"
      })
    };
    const loginResponse = await loginUser(loginEvent);
    const loginBody = JSON.parse(loginResponse.body);
    token = loginBody.token;
    expect(token).toBeDefined();

    // Fetch user from DB to get userId
    const user = await User.findOne({ username: "testuser_expense" });
    userId = user._id.toString();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should add a new expense", async () => {
    const event = {
      body: JSON.stringify({
        description: "Groceries",
        category: "Food",
        amount: 50
      }),
      requestContext: {
        authorizer: {
          userId: userId
        }
      }
    };

    const response = await addExpense(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(201);
    expect(body.expense).toHaveProperty("_id");
    expect(body.expense.amount).toBe(50);
    expenseId = body.expense._id;
  });

  test("should fetch all expenses", async () => {
    const event = {
      requestContext: {
        authorizer: {
          userId: userId
        }
      }
    };

    const response = await getExpense(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body.some(exp => exp._id === expenseId)).toBe(true);
  });

  test("should delete an expense", async () => {
    const event = {
      requestContext: {
        authorizer: {
          userId: userId
        }
      },
      pathParameters: {
        id: expenseId
      }
    };

    const response = await deleteExpense(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(body.message).toBe("Expense deleted successfully");

    const fetchEvent = {
      requestContext: {
        authorizer: {
          userId: userId
        }
      }
    };

    const fetchResponse = await getExpense(fetchEvent);
    const fetchBody = JSON.parse(fetchResponse.body);
    expect(fetchResponse.statusCode).toBe(200);
    expect(fetchBody.some(exp => exp._id === expenseId)).toBe(false);
  });
});
