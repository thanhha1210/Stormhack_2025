import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  };

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, navigate]);

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isLoading}
                className="border"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <label htmlFor="password">Password</label>
                <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <input id="password" type="password" required disabled={isLoading} className="border" />
            </div>
            <button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <span className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
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
      <div className="hidden bg-muted lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-4xl font-headline font-bold">NoteFusion</h2>
          <p className="text-lg mt-2 max-w-md">The smartest way to consolidate and comprehend your weekly studies.</p>
        </div>
      </div>
    </div>
  );
}
