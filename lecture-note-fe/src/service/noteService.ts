// src/services/noteService.ts
import api from "./api";

export const noteService = {
  getNotes: async () => {
    const res = await api.get("/notes");
    return res.data;
  },

  getNotesForCourse: async (courseId: string) => {
    const res = await api.get(`/courses/${courseId}/notes`);
    return res.data;
  },

  getCourse: async (courseId: string) => {
    const res = await api.get(`/courses/${courseId}`);
    return res.data;
  },

  uploadNote: async (file: File, courseId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("course", courseId);

    // When sending FormData, the browser automatically sets the correct
    // Content-Type header (multipart/form-data).
    const res = await api.post("/notes", formData);
    return res.data;
  },
};
