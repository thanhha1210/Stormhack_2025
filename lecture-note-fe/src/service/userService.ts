// src/services/userService.ts
import api from "./api";

export const userService = {
  register: async (name: string, email: string, password: string) => {
    const res = await api.post("/users", { name, email, password });
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await api.post("/auth", { email, password });
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get("/users/me");
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};
