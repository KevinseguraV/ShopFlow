import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  const userData = localStorage.getItem("user");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (userData) {
    const user = JSON.parse(userData);

    if (user?.id) {
      config.headers["X-User-Id"] = user.id;
    }
    if (user?.role) {
      config.headers["X-User-Role"] = user.role;
    }
  }

  return config;
});

export default api;