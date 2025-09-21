import { auth } from "../middleware/auth.js";
import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

// Create budget
router.post("/", auth, async (req, res) => {
  try {
    const { category, limit, period = "monthly", notes = "" } = req.body;
    if (!category || isNaN(Number(limit)))
      return res.status(400).json({ message: "Invalid data" });
    const b = new Budget({
      user: req.user.id,
      category,
      limit: Number(limit),
      period,
      notes,
    });
    await b.save();
    res.json(b);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get budgets for user
router.get("/", auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update budget
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findById(id);
    if (!budget) return res.status(404).json({ message: "Not found" });
    if (budget.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { category, limit, period, active, notes } = req.body;
    if (category !== undefined) budget.category = category;
    if (limit !== undefined) budget.limit = Number(limit);
    if (period) budget.period = period;
    if (active !== undefined) budget.active = active;
    if (notes !== undefined) budget.notes = notes;
    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete budget
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findById(id);
    if (!budget) return res.status(404).json({ message: "Not found" });
    if (budget.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    await budget.remove();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/progress", auth, async (req, res) => {
  try {
    const { month } = req.query; // optional, format YYYY-MM, defaults to current month
    const userId = mongoose.Types.ObjectId(req.user.id);

    const now = new Date();
    let year = now.getFullYear(),
      m = now.getMonth() + 1;
    if (month) {
      const [y, mm] = month.split("-").map(Number);
      if (!isNaN(y) && !isNaN(mm)) {
        year = y;
        m = mm;
      }
    }
    // month start and end
    const start = new Date(year, m - 1, 1, 0, 0, 0);
    const end = new Date(year, m, 0, 23, 59, 59, 999);

    // fetch budgets for user
    const budgets = await Budget.find({
      user: req.user.id,
      active: true,
    }).lean();

    if (!budgets.length) return res.json([]);

    // aggregate expense sums grouped by category within date range
    const agg = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: "$category", totalSpent: { $sum: "$amount" } } },
    ]);

    // map category->spent
    const spentMap = {};
    agg.forEach((a) => {
      spentMap[a._id] = a.totalSpent;
    });

    // compose response per budget
    const result = budgets.map((b) => {
      const spent = spentMap[b.category] || 0;
      const pct = b.limit > 0 ? Math.min(100, (spent / b.limit) * 100) : 0;
      return {
        _id: b._id,
        category: b.category,
        limit: b.limit,
        period: b.period,
        spent,
        percent: +pct.toFixed(2),
        notes: b.notes,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
