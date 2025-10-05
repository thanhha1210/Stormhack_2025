import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, navigate]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#020617] via-[#0B1120] to-black flex items-center justify-center overflow-hidden">
      {/* 🌠 Starfield background (animated) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent animate-pulse" />
        <div className="stars absolute inset-0"></div>
        <div className="shooting-stars absolute inset-0"></div>
      </div>

      {/* 🪐 Floating planet (visual flair) */}
      <div className="absolute right-10 top-20 w-60 h-60 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-full blur-3xl opacity-40 animate-float" />

      {/* Login container */}
      <div className="relative bg-[#0f172a]/70 backdrop-blur-xl border border-indigo-900/30 rounded-3xl p-10 shadow-2xl w-[370px] text-center text-white">
        <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Log in to your cosmic study journey 🌌
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-6 text-left">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="astronaut@space.edu"
              required
              disabled={isLoading}
              className="mt-1 w-full px-4 py-2 rounded-md bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              disabled={isLoading}
              className="mt-1 w-full px-4 py-2 rounded-md bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md font-semibold text-white hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            {isLoading ? "Warping to dashboard..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-cyan-400 hover:text-cyan-300 font-medium underline transition-all duration-300 active:scale-95"
          >
            Join the Crew
          </button>
        </div>
        
      </div>
      {/* 🌍 Earth horizon glow */}
      <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-blue-800/40 via-indigo-900/20 to-transparent blur-2xl"></div>
      <button onClick={()=> navigate("/signup")} className="w-[300px] text-white">
          Join the Crew
      </button>
    </div>
  );
}
