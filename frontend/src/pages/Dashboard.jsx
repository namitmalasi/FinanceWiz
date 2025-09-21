import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import TransactionsPanel from "../components/TransactionsPanel.jsx";

export default function Dashboard() {
  const { logout, user } = useAuth();
  const nav = useNavigate();
  async function handleLogout() {
    await logout();
    nav("/login");
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl">Personal Finance Dashboard</h1>
        <div>
          <span className="mr-3">Hi, {user?.name || user?.email}</span>
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsPanel />
        <div>
          {/* keep your calculators here (SIP, SWP) or other widgets */}
        </div>
      </div>
    </div>
  );
}
