import { http } from "./http";
import { saveSession } from "./session";

export const authService = {
  async login(email, password) {
    try {
      console.log(" Logging in with:", { email, password: "***" });
      const res = await http.post("/api/it-path/auth/login", { email, password });
      console.log("✅ Login response:", res.data);
      
      // Backend returns: { code, message, data: { accessToken, tokenType, userId, userName, role } }
      const authData = res.data.data;
      const token = authData.accessToken;
      const role = authData.role;
      
      if (token) {
        saveSession({ token, role });
        console.log("✅ Session saved");
      } else {
        console.warn("⚠️ No token in response");
      }
      return authData; // Return the inner data object
    } catch (error) {
      console.error("❌ Login error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  async register(data) {
    const res = await http.post("/api/it-path/auth/register", data);
    return res.data;
  },
};