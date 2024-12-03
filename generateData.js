import mongoose from "mongoose";
import dotenv from "dotenv";
import faker from "faker";
import User from "./models/User.js";
import Expense from "./models/Expense.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const generateData = async () => {
  try {

    await User.deleteMany({});
    await Expense.deleteMany({});

    const user = new User({
      username: "testuser",
      password: "password123"
    });
    await user.save();

    const categories = ["Food", "Transportation", "Utilities", "Entertainment", "Healthcare", "Housing", "Miscellaneous"];

    const expenses = [];
    for (let i = 0; i < 500; i++) {
      expenses.push({
        description: faker.commerce.productName(),
        category: categories[Math.floor(Math.random() * categories.length)],
        amount: parseFloat(faker.commerce.price(10, 1000, 2)),
        user: user._id,
        date: faker.date.between('2022-01-01', '2023-12-31')
      });
    }

    await Expense.insertMany(expenses);

    console.log("Synthetic data generated successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error generating data:", err);
    mongoose.connection.close();
  }
};

generateData();
