import { http } from "./http";

// ============================================
// USER PROFILE SERVICE
// ============================================

/**
 * Lấy thông tin profile của user đang đăng nhập
 * @returns {Promise<Object>}
 */
export const getUserProfile = async () => {
    const res = await http.get("/api/it-path/users/user_profile/me");
    return res.data.data;
};

/**
 * Cập nhật thông tin profile của user đang đăng nhập
 * @param {Object} profileData - Dữ liệu profile cần cập nhật
 * @returns {Promise<Object>}
 */
export const updateUserProfile = async (profileData) => {
    const res = await http.put("/api/it-path/users/user_profile/me", profileData);
    return res.data.data;
};
