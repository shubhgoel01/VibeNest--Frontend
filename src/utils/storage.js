// utils/storage.js
export const storage = {
  getToken: () => {
    try {
      return localStorage.getItem("accessToken");
    } catch {
      return null;
    }
  },

  setToken: (token) => {
    try {
      localStorage.setItem("accessToken", token);
    } catch {}
  },

  removeToken: () => {
    try {
      localStorage.removeItem("accessToken");
    } catch {}
  },
};
