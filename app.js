import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// process.env.MONGO_URI ="mongodb://localhost:27017/Finance-tracker";
// process.env.NODE_ENV="test";


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));


console.log("Server is setting up routes");
app.use("/api/auth", authRoutes);


// app.listen(3000, () => console.log("Server running on port 3000"));

export default app;