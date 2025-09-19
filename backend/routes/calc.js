import express from "express";
import User from "../models/User.js";
import { calculateSIP, calculateSWP } from "../utils/calculators.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Calculate SIP (returns results without saving)
router.post("/sip", (req, res) => {
  const { monthlyInvestment, expectedReturn, years } = req.body;
  const monthly = parseFloat(monthlyInvestment);
  const annual = parseFloat(expectedReturn);
  const yrs = parseFloat(years);
  if (isNaN(monthly) || isNaN(annual) || isNaN(yrs)) {
    return res.status(400).json({ message: "Invalid inputs" });
  }
  const result = calculateSIP(monthly, annual, yrs);
  res.json(result);
});

router.post("/swp", (req, res) => {
  const { corpus, annualReturnPercent, monthlyWithdrawal, years } = req.body;
  const corpusNum = parseFloat(corpus);
  const annualNum = parseFloat(annualReturnPercent);
  const monthlyWithdrawNum = parseFloat(monthlyWithdrawal);
  const yrs = parseFloat(years);

  if ([corpusNum, annualNum, monthlyWithdrawNum, yrs].some((v) => isNaN(v))) {
    return res.status(400).json({ message: "Invalid inputs" });
  }

  const result = calculateSWP(corpusNum, annualNum, monthlyWithdrawNum, yrs);
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/saved", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.savedCalculations || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
