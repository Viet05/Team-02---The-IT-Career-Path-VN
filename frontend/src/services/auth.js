import { http } from "./http";
import { saveSession } from "./session";

// ============================================
// SERVICE ĐĂNG NHẬP / ĐĂNG KÝ
// ============================================

export const authService = {
  // Hàm đăng nhập
  async login(email, password) {
    try {
      console.log(" Logging in with:", { email, password: "***" });
      
      // Gửi request POST tới backend
      const res = await http.post("/api/it-path/auth/login", { email, password });
      console.log("✅ Login response:", res.data);
      
      // Backend trả về: { code, message, data: { accessToken, tokenType, userId, userName, role } }
      const authData = res.data.data;
      const token = authData.accessToken;
      const role = authData.role;
      
      // Nếu có token thì lưu vào localStorage
      if (token) {
        saveSession({ token, role });
        console.log("✅ Session saved");
      } else {
        console.warn("⚠️ No token in response");
      }
      
      // Trả về dữ liệu user (không có token để bảo mật)
      return authData;
    } catch (error) {
      console.error("❌ Login error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Hàm đăng ký
  async register(data) {
    try {
      console.log("📝 Registering with:", { 
        username: data.username, 
        email: data.email, 
        password: "***" 
      });      
      // Gửi request POST tới backend với thông tin đăng ký
      const res = await http.post("/api/it-path/auth/register", data);
      console.log("✅ Register response:", res.data);
      const responseData = res.data.data || res.data;
      return responseData;
    } catch (error) {
      console.error("❌ Register error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Hàm xác nhận email
  async verifyEmail(token) {
    try {
      console.log("✉️ Verifying email with token:", token);
      // Gửi request GET tới backend với token xác nhận
      const res = await http.get(`/api/it-path/auth/verify-email?token=${token}`);
      console.log("✅ Email verification response:", res.data); 
      return res.data.data;
    } catch (error) {
      console.error("❌ Email verification error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
  // Hàm xem user 
  async getUserInfo() {
    try {
      console.log("👤 Fetching user info")  
      const res = await http.get("/api/it-path/admin/users");
      console.log("✅ User info response:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("❌ User <info> error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },
  // Hàm xóa user
  async deleteUser(id) {
    try {
      console.log("👤 Deleting user with id:", id);  
      const res = await http.delete(`/api/it-path/admin/users/{id}`);
      console.log("✅ User delete response:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("❌ User delete error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
  // Hàm chỉnh sửa 
  async editUser(id, data) {
    try {
      console.log("👤 Editing user with id:", id);  
      const res = await http.put(`/api/it-path/admin/users/${id}`, data);
      console.log("✅ User edit response:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("❌ User edit error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
  // getUserProfile
  async getUserProfile() {
    try {
      console.log("👤 Fetching user profile")  
      const res = await http.get("/api/it-path/user/profile");
      console.log("✅ User profile response:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("❌ User <profile> errorr",{
        status : error.response?.status,
        data : error.response?.data,
        message : error.message,
      });
      throw error;
      }
    }
      
};