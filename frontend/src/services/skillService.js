import { http } from "./http";

// ============================================
// SKILL SERVICE
// ============================================

/**
 * Lấy tất cả skills trong hệ thống (Admin endpoint nhưng không cần auth)
 * @returns {Promise<Array>}
 */
export const getAllSkills = async () => {
    const res = await http.get("/api/it-path/admin/skills");
    return res.data.data;
};

/**
 * Lấy danh sách kỹ năng của user hiện tại
 * Yêu cầu đăng nhập
 * @returns {Promise<Array>}
 */
export const getUserSkills = async () => {
    const res = await http.get("/api/it-path/users/user_profile/skills/me");
    return res.data.data;
};

/**
 * Thêm kỹ năng cho user
 * @param {number} skillId - ID của skill
 * @param {string} level - Mức độ (e.g. "BEGINNER", "INTERMEDIATE", "ADVANCED")
 * @returns {Promise<Object>}
 */
export const addUserSkill = async (skillId, level) => {
    const res = await http.post("/api/it-path/users/user_profile/skills", {
        skillId,
        level,
    });
    return res.data.data;
};

/**
 * Cập nhật level của kỹ năng
 * @param {number} userProfileSkillId - ID của bản ghi kỹ năng của user
 * @param {string} level - Mức độ mới
 * @returns {Promise<Object>}
 */
export const updateUserSkill = async (userProfileSkillId, level) => {
    const res = await http.put(
        `/api/it-path/users/user_profile/skills/${userProfileSkillId}`,
        { level }
    );
    return res.data.data;
};

/**
 * Xóa kỹ năng khỏi hồ sơ user
 * @param {number} userProfileSkillId - ID của bản ghi kỹ năng của user
 * @returns {Promise<void>}
 */
export const deleteUserSkill = async (userProfileSkillId) => {
    await http.delete(
        `/api/it-path/users/user_profile/skills/${userProfileSkillId}`
    );
};
