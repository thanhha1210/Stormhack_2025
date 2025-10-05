import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../service/userService";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 🛰️ Register with backend
      const res = await userService.register(form.name, form.email, form.password);

      // 💾 Save token and navigate
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("❌ Signup failed:", err);
      setError(err.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#020617] via-[#0a0e1a] to-black flex items-center justify-center">
      {/* 🌌 Animated stars */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.05),transparent_80%)] animate-pulse" />
        <div className="stars absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] before:opacity-40" />
      </div>

      {/* 🪐 Floating planets */}
      <div className="absolute top-10 left-20 w-72 h-72 bg-gradient-to-r from-blue-700 to-cyan-400 rounded-full blur-3xl opacity-30 animate-float-slow" />
      <div className="absolute bottom-20 right-24 w-64 h-64 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full blur-3xl opacity-20 animate-float" />

      {/* 🚀 Signup container */}
      <div className="relative z-10 bg-[#0f172a]/80 backdrop-blur-xl border border-cyan-900/40 rounded-3xl shadow-[0_0_30px_rgba(34,211,238,0.3)] p-10 w-[400px] text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center">
          Join the Crew 🚀
        </h1>
        <p className="text-slate-400 mt-3 text-center text-sm">
          Sign up and start your cosmic learning journey
        </p>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-300 mt-4 p-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="mt-8 space-y-5 text-left">
          <div>
            <label htmlFor="name" className="block text-slate-300 text-sm mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Commander Nova"
              disabled={isLoading}
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900/70 border border-cyan-800/40 rounded-md text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-slate-300 text-sm mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="nova@spaceacademy.com"
              disabled={isLoading}
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900/70 border border-cyan-800/40 rounded-md text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-slate-300 text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              disabled={isLoading}
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900/70 border border-cyan-800/40 rounded-md text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Signup button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md font-semibold text-white hover:from-cyan-400 hover:to-blue-500 active:scale-95 transition-all duration-200 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-slate-700"></div>

        {/* Login link */}
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:text-cyan-300 font-medium underline active:scale-95 transition-all"
          >
            Log In
          </button>
        </p>
      </div>

      {/* 🌍 Planet glow horizon */}
      <div className="absolute bottom-0 w-full h-[250px] bg-gradient-to-t from-blue-800/30 via-indigo-900/10 to-transparent blur-3xl" />
    </div>
  );
}
