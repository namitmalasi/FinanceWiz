// Returns { investedAmount, maturityValue, totalReturns }
export function calculateSIP(monthly, annualReturnPercent, years) {
  const r = annualReturnPercent / 100 / 12; // monthly rate
  const n = years * 12;
  // Future value of series: P * [ ( (1+r)^n - 1) / r ] * (1+r)
  const invested = monthly * n;
  const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return {
    investedAmount: +invested.toFixed(2),
    maturityValue: +fv.toFixed(2),
    totalReturns: +(fv - invested).toFixed(2),
  };
}

// SWP: Given corpus, annualReturnPercent, monthly withdrawal, years -> returns whether corpus lasts and remaining corpus
export function calculateSWP(
  corpus,
  annualReturnPercent,
  monthlyWithdrawal,
  years
) {
  const r = annualReturnPercent / 100 / 12;
  const n = years * 12;
  let balance = corpus;
  for (let i = 0; i < n; i++) {
    balance = balance * (1 + r) - monthlyWithdrawal;
    if (balance <= 0) return { exhaustedAtMonth: i + 1, remaining: 0 };
  }
  return { remaining: +balance.toFixed(2), exhaustedAtMonth: null };
}
