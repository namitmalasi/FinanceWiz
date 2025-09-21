import express from "express";
import { auth } from "../middleware/auth.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// Create transaction
router.post("/", auth, async (req, res) => {
  try {
    const { type, category, amount, date, notes } = req.body;
    if (
      !type ||
      !["income", "expense"].includes(type) ||
      !category ||
      !amount
    ) {
      return res.status(400).json({ message: "Invalid transaction data" });
    }
    const tx = new Transaction({
      user: req.user.id,
      type,
      category,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      notes: notes || "",
    });
    await tx.save();
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get transactions (with optional filters: start, end, type, category)
router.get("/", auth, async (req, res) => {
  try {
    const { start, end, type, category } = req.query;
    const filter = { user: req.user.id };
    if (type && ["income", "expense"].includes(type)) filter.type = type;
    if (category) filter.category = category;
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(start);
      if (end) filter.date.$lte = new Date(end);
    }
    const txs = await Transaction.find(filter).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update transaction
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: "Not found" });
    if (tx.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { type, category, amount, date, notes } = req.body;
    if (type) tx.type = type;
    if (category) tx.category = category;
    if (amount !== undefined) tx.amount = Number(amount);
    if (date) tx.date = new Date(date);
    if (notes !== undefined) tx.notes = notes;
    await tx.save();
    res.json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ message: "Not found" });
    if (tx.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    await tx.remove();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
