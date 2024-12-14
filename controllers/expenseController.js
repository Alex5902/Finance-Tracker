import Expense from "../models/Expense.js";
import { connectToDatabase } from "../utils/db.js";

export const addExpense = async (event) => {
  try {
    await connectToDatabase();
    const body = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.userId;

    const newExpense = await Expense.create({
      user: userId,
      description: body.description,
      category: body.category,
      amount: body.amount,
      date: new Date(),
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Expense added successfully", expense: newExpense }),
    };
  } catch (error) {
    console.error("Error adding expense:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const getExpense = async (event) => {
  try {
    await connectToDatabase();
    const userId = event.requestContext.authorizer.userId;
    const expenses = await Expense.find({ user: userId });

    return {
      statusCode: 200,
      body: JSON.stringify(expenses),
    };
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const deleteExpense = async (event) => {
  try {
    await connectToDatabase();
    const userId = event.requestContext.authorizer.userId;
    const expenseId = event.pathParameters.id;

    const expense = await Expense.findOneAndDelete({ _id: expenseId, user: userId });

    if (!expense) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Expense not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Expense deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};


