import React, { useState } from "react";

export default function TransactionForm({ onAdd, initial = null }) {
  const [type, setType] = useState(initial?.type || "expense");
  const [category, setCategory] = useState(initial?.category || "");
  const [amount, setAmount] = useState(initial?.amount || "");
  const [date, setDate] = useState(
    initial
      ? new Date(initial.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState(initial?.notes || "");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!category || !amount) return alert("Please add category & amount");
    setSubmitting(true);
    try {
      await onAdd({ type, category, amount: Number(amount), date, notes });
      // reset only when adding new (not editing)
      if (!initial) {
        setCategory("");
        setAmount("");
        setNotes("");
        setType("expense");
        setDate(new Date().toISOString().slice(0, 10));
      }
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end"
    >
      <div>
        <label className="block text-sm">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div>
        <label className="block text-sm">Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Food, Salary"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm">Amount</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm">Date</label>
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="md:col-span-4">
        <label className="block text-sm">Notes</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="md:col-span-4">
        <button
          disabled={submitting}
          className="mt-2 p-2 bg-indigo-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}
