import axios from "axios";
import { getToken } from "./session";

// ============================================
// HTTP CLIENT - CẤU HÌNH AXIOS
// ============================================

// Tạo instance axios với cấu hình mặc định
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL backend từ .env (ví dụ: http://localhost:8080)
  withCredentials: true, // Gửi cookies cùng request
});

// Middleware chặn request: tự động thêm token Authorization
http.interceptors.request.use((config) => {
  // Lấy token từ localStorage
  const token = getToken();
  
  // Nếu có token thì thêm vào header Authorization
  // Backend sẽ kiểm tra: Authorization: Bearer <token>
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});
