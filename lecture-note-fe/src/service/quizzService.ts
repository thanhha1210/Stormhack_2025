// src/services/quizService.ts
import api from "./api";

export const quizService = {
  generateQuizzes: async (noteId: string, pdfUrl: string) => {
    const res = await api.post("/quizzes/generate", { noteId, pdfUrl });
    return res.data;
  },

  getQuizzesByNote: async (noteId: string) => {
    const res = await api.get(`/quizzes?noteId=${noteId}`);
    return res.data;
  },
};
