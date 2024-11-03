import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: String,
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Expense", ExpenseSchema);
