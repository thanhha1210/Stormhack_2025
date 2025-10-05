// src/services/flashcardService.ts
import api from "./api";

export const flashcardService = {
  generateFromNote: async (noteId: string, pdfUrl: string) => {
    const res = await api.post("/flashcards", { noteId, pdfUrl });
    return res.data;
  },

  getFlashcardsByNote: async (noteId: string) => {
    const res = await api.get(`/flashcards?noteId=${noteId}`);
    return res.data;
  },
};
