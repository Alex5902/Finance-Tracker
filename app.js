import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expense.js";
import express from "express";

if (process.env.NODE_ENV === "test") {
    dotenv.config({ path: ".env.test" });
} else {
    dotenv.config();
}

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));


console.log("Server is setting up routes");
app.use("/api/auth", authRoutes);
app.use("/api/expense", expenseRoutes);

// app.listen(3000, () => console.log("Server running on port 3000"));

export default app;