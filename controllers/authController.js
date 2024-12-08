import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { connectToDatabase } from "../utils/db.js";

export const registerUser = async (event) => {
  try {
    await connectToDatabase();
    const body = JSON.parse(event.body);
    const user = await User.create(body);
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User registered successfully",
        user: { id: user._id, username: user.username },
      }),
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const loginUser = async (event) => {
  try {
    await connectToDatabase();
    const { username, password } = JSON.parse(event.body);
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
