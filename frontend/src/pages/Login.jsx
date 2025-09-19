import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      nav("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl mb-4">Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button className="w-full p-2 bg-indigo-600 text-white rounded">
          Login
        </button>
      </form>
    </div>
  );
}
