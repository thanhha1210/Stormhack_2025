import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { noteService } from "../service/noteService";
import FileUpload from "../components/FileUpload";

// Define interfaces for our data structures
interface ILectureNote {
  _id: string;
  title: string;
  pdfUrl: string;
  createdAt: string;
}

interface ICourse {
  _id: string;
  code: string;
  title: string;
}

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [notes, setNotes] = useState<ILectureNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      navigate("/dashboard");
      return;
    }

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseData = await noteService.getCourse(id);
        const notesData = await noteService.getNotesForCourse(id);
        setCourse(courseData);
        setNotes(notesData);
      } catch (err: any) {
        console.error("Failed to load course data:", err);
        setError("Failed to load course data. It might not exist or you may not have access.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, navigate]);

  const handleUploadSuccess = (newNote: ILectureNote) => {
    // Add the new note to the list to re-render
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  if (loading) {
    return <div className="text-center text-cyan-300 p-10">Loading Course...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 p-10">{error}</div>;
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#020617] via-[#0B1120] to-black text-white p-8">
      <button onClick={() => navigate('/dashboard')} className="mb-6 bg-cyan-700/50 text-cyan-200 px-4 py-2 rounded-md hover:bg-cyan-600/50 transition-all">
        &larr; Back to Dashboard
      </button>

      {course && (
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-300">{course.code}</h1>
          <p className="text-xl text-slate-400">{course.title}</p>
        </header>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-cyan-300 mb-4">Lecture Notes</h2>
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note._id} className="p-4 rounded-lg bg-slate-900/60 border border-cyan-800/30 flex justify-between items-center">
                  <p className="text-slate-200">{note.title}</p>
                  <a href={`http://localhost:3001/${note.pdfUrl}`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    View PDF
                  </a>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No notes have been uploaded for this course yet.</p>
            )}
          </div>
        </div>

        <div>
          <FileUpload courseId={id!} onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
    </div>
  );
}
