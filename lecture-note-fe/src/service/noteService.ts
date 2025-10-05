// src/services/noteService.ts
import api from "./api";

export const noteService = {
  getNotes: async () => {
    const res = await api.get("/notes");
    return res.data;
  },

  uploadNote: async (courseId: string, title: string, pdfUrl: string) => {
    const res = await api.post("/notes", { courseId, title, pdfUrl });
    return res.data;
  },
};
