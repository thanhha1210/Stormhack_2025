import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../service/userService";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await userService.register(form.name, form.email, form.password);
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#020617] via-[#0B1120] to-black flex items-center justify-center overflow-hidden">
      {/* 🌠 Animated background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent animate-pulse" />
      </div>

      {/* 💫 Floating orb */}
      <div className="absolute left-10 bottom-20 w-72 h-72 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full blur-3xl opacity-40 animate-float" />

      {/* 🪐 Signup card */}
      <div className="relative bg-[#0f172a]/70 backdrop-blur-xl border border-indigo-900/30 rounded-3xl p-10 shadow-2xl w-[400px] text-center text-white transition-all duration-300 hover:shadow-cyan-500/20">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Join the Crew 🚀
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Create your account and start your cosmic learning journey
        </p>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-300 mt-4 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="mt-8 space-y-5 text-left">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-slate-300">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              onChange={handleChange}
              value={form.name}
              disabled={loading}
              placeholder="Commander Nova"
              className="mt-1 w-full px-4 py-2 rounded-md bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              onChange={handleChange}
              value={form.email}
              disabled={loading}
              placeholder="nova@spaceacademy.com"
              className="mt-1 w-full px-4 py-2 rounded-md bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              onChange={handleChange}
              value={form.password}
              disabled={loading}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 rounded-md bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          {/* 🌈 Sign Up Button — hover + active animations */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-2 rounded-md font-semibold text-white transition-all duration-300 
            ${loading
              ? "bg-cyan-800 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95"}`}
          >
            {loading ? "Launching..." : "Sign Up"}
          </button>
        </form>

        {/* 🌀 Link to login */}
        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:text-cyan-300 font-medium underline transition-all duration-300 hover:shadow-[0_0_10px_rgba(6,182,212,0.4)] active:scale-95"
          >
            Log In
          </button>
        </p>
      </div>

      {/* 🌍 Horizon glow */}
      <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-blue-800/40 via-indigo-900/20 to-transparent blur-2xl"></div>
    </div>
  );
}
