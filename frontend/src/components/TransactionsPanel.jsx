import { useEffect, useState } from "react";
import API from "../utils/api";
import TransactionForm from "./TransactionForm";
import TransactionsList from "./TransactionsList";

export default function TransactionsPanel() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTransactions(filters = {}) {
    try {
      setLoading(true);
      const res = await API.get("/transactions", { params: filters });
      setTransactions(res.data);
    } catch (err) {
      console.error("Fetch transactions failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function handleAdd(txData) {
    try {
      const res = await API.post("/transactions", txData);
      // prepend new transaction
      setTransactions((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Add failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this transaction?")) return;
    try {
      await API.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  async function handleUpdate(id, updated) {
    try {
      const res = await API.put(`/transactions/${id}`, updated);
      setTransactions((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl mb-3">Income & Expense</h2>
      <TransactionForm onAdd={handleAdd} />
      <div className="mt-4">
        {loading ? (
          <div>Loading transactions...</div>
        ) : (
          <TransactionsList
            transactions={transactions}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}
