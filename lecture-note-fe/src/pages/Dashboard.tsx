import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../service/api";

interface Course {
  _id: string;
  code: string;
  title: string;
  term: string;
  createdAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🧭 Fetch user + courses
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await api.get("/users/me");
        const coursesRes = await api.get("/courses");
        setUser(userRes.data);
        setCourses(coursesRes.data);
      } catch (err: any) {
        console.error("Failed to load dashboard:", err);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  // 🌠 Add a new course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/courses", { code: newCode });
      setCourses([res.data, ...courses]);
      setNewCode("");
    } catch (err: any) {
      console.error("Add course failed:", err);
      setError(err.response?.data?.error || "Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#020617] via-[#0B1120] to-black text-white overflow-hidden">
      {/* 🌌 Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.05),transparent_80%)] animate-pulse" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-indigo-600 to-purple-600 blur-3xl opacity-25 animate-float" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-gradient-to-tr from-cyan-600 to-blue-700 blur-3xl opacity-30 animate-float-slow" />
      </div>

      {/* 🧑‍🚀 Header */}
      <header className="flex justify-between items-center px-10 py-6 border-b border-cyan-900/40 backdrop-blur-md">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          NoteFusion 🚀
        </h1>
        <div className="flex items-center gap-6">
          {user && (
            <div className="text-right">
              <p className="font-semibold text-cyan-300">{user.name}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-md hover:from-pink-500 hover:to-red-400 active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 🪐 Dashboard Content */}
      <main className="max-w-5xl mx-auto p-8">
        <h2 className="text-2xl font-semibold mb-6 text-cyan-300">
          My Courses 🌠
        </h2>

        {/* 🌟 Add Course Form */}
        <form
          onSubmit={handleAddCourse}
          className="flex gap-3 mb-8 items-center"
        >
          <input
            type="text"
            placeholder="Enter course code (e.g., CMPT 225)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-900/70 border border-cyan-700/40 rounded-md focus:ring-2 focus:ring-cyan-500 outline-none text-white"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md font-semibold hover:from-blue-500 hover:to-cyan-400 active:scale-95 transition-all"
          >
            {loading ? "Adding..." : "Add Course"}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/40 border border-red-500 text-red-300 mb-6 p-3 rounded">
            {error}
          </div>
        )}

        {/* 🧾 Courses List */}
        <div className="grid md:grid-cols-2 gap-6">
          {courses.length === 0 ? (
            <p className="text-slate-400 text-center col-span-2">
              No courses yet. Add one to get started!
            </p>
          ) : (
            courses.map((course) => (
              <Link to={`/courses/${course._id}`} key={course._id}>
                <div className="p-5 rounded-xl bg-slate-900/60 border border-cyan-800/30 shadow-md hover:shadow-cyan-500/20 transition-all duration-200 h-full">
                  <h3 className="text-xl font-semibold text-cyan-300">
                    {course.code}
                  </h3>
                  <p className="text-slate-300">{course.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{course.term}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>

      {/* 🌍 Glow */}
      <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-blue-800/40 via-indigo-900/20 to-transparent blur-3xl" />
    </div>
  );
}
