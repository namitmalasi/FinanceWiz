import express from "express";
import { auth } from "../middleware/auth.js";
import User from "../models/User.js";
import { calculateSIP } from "../utils/calculators.js";

const router = express.Router();

// Calculate SIP (returns results without saving)
router.post("/sip", auth, (req, res) => {
  const { monthlyInvestment, expectedReturn, years } = req.body;
  const result = calculateSIP(monthlyInvestment, expectedReturn, years);
  res.json(result);
});

// Save calculation to user profile
router.post("/save", auth, async (req, res) => {
  const userId = req.user.id;
  const { type, payload, result } = req.body;
  try {
    const user = await User.findById(userId);
    user.savedCalculations.push({
      type,
      payload,
      result,
      createdAt: new Date(),
    });
    await user.save();
    res.json({ message: "Saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
