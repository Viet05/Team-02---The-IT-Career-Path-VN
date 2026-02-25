import { http } from "./http";

// ============================================
// JOB RECOMMENDATION SERVICE
// ============================================

/**
 * Lấy danh sách việc làm được gợi ý dựa trên hồ sơ user
 * Yêu cầu đăng nhập
 * @param {number} topN - Số lượng việc làm muốn gợi ý (1-50, mặc định 10)
 * @returns {Promise<Array>} Danh sách việc làm được gợi ý
 */
export const getRecommendations = async (topN = 10) => {
    const res = await http.get("/api/it-path/users/recommendations", {
        params: { topN },
    });
    return res.data.data;
};
