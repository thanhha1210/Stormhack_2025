import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api"; // your axios instance

interface Course {
  _id: string;
  title: string;
  description: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  // 🛰️ Add a new course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await api.post("/courses", form);
      setForm({ title: "", description: "" });
      fetchCourses();
    } catch (err) {
      console.error("Failed to add course:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#020617] via-[#0B1120] to-black text-white flex flex-col items-center p-10 overflow-hidden">
      {/* 🌠 Starfield backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent animate-pulse" />

      <div className="flex justify-between w-full max-w-4xl mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          🚀 My Courses
        </h1>
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-slate-300 hover:text-cyan-400 underline transition-all"
        >
          Logout
        </button>
      </div>

      {/* 🌌 Add Course Form */}
      <form
        onSubmit={handleAddCourse}
        className="bg-[#0f172a]/60 backdrop-blur-md border border-indigo-900/40 rounded-2xl p-6 w-full max-w-md mb-10 shadow-xl hover:shadow-cyan-500/10 transition"
      >
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">Add New Course</h2>
        <div className="space-y-4">
          <input
            type="text"
            id="title"
            placeholder="Course Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
          />
          <textarea
            id="description"
            placeholder="Short description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 active:scale-95"
          >
            {loading ? "Adding..." : "Add Course"}
          </button>
        </div>
      </form>

      {/* 🌌 Display Courses */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="bg-[#0f172a]/60 border border-slate-800 rounded-2xl p-5 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-cyan-400">
                {course.title}
              </h3>
              <p className="text-slate-400 mt-2 text-sm">
                {course.description || "No description"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-center col-span-full mt-10">
            No courses yet — start your journey 🚀
          </p>
        )}
      </div>

      {/* 🌍 Horizon glow */}
      <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-blue-800/40 via-indigo-900/20 to-transparent blur-2xl"></div>
    </div>
  );
}
