import express from "express";
import { addExpense, getExpense, deleteExpense } from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", addExpense);
router.get("/", getExpense);
router.delete("/:id", deleteExpense);

export default router;
