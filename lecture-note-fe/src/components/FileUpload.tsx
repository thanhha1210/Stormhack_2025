import React, { useState } from "react";
import { noteService } from "../service/noteService";

interface FileUploadProps {
  courseId: string;
  onUploadSuccess: (newNote: any) => void;
}

export default function FileUpload({ courseId, onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError(""); // Clear previous errors
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await noteService.uploadNote(file, courseId);
      onUploadSuccess(res.note); // Pass the new note back to the parent
      setFile(null); // Reset file input
    } catch (err: any) {
      console.error("File upload failed:", err);
      setError(err.response?.data?.error || "File upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-800/30 shadow-lg">
      <h3 className="text-xl font-semibold text-cyan-300 mb-4">Upload New Note</h3>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="flex-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-700/50 file:text-cyan-200 hover:file:bg-cyan-600/50 transition-all duration-200"
        />
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md font-semibold text-white hover:from-blue-500 hover:to-cyan-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  );
}
