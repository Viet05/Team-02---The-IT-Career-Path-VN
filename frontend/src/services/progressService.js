import { http } from "./http";

// ============================================
// LEARNING PROGRESS SERVICE
// ============================================

/**
 * Lấy danh sách tiến độ học tập của user hiện tại
 * @returns {Promise<Array>}
 */
export const getUserProgress = async () => {
    const res = await http.get("/api/it-path/progress");
    return res.data.data;
};

/**
 * Bắt đầu học một roadmap node
 * @param {number} roadmapNodeId - ID của node
 * @returns {Promise<Object>}
 */
export const startProgress = async (roadmapNodeId) => {
    const res = await http.post(`/api/it-path/progress/start/${roadmapNodeId}`);
    return res.data.data;
};

/**
 * Đánh dấu hoàn thành một roadmap node
 * @param {number} roadmapNodeId - ID của node
 * @returns {Promise<Object>}
 */
export const completeProgress = async (roadmapNodeId) => {
    const res = await http.post(`/api/it-path/progress/complete/${roadmapNodeId}`);
    return res.data.data;
};

/**
 * Reset tiến độ của một roadmap node
 * @param {number} roadmapNodeId - ID của node
 * @returns {Promise<void>}
 */
export const resetProgress = async (roadmapNodeId) => {
    await http.post(`/api/it-path/progress/reset/${roadmapNodeId}`);
};

/**
 * Lấy số lượng node đã hoàn thành
 * @returns {Promise<number>}
 */
export const getCompletedCount = async () => {
    const res = await http.get("/api/it-path/progress/completed-count");
    return res.data.data;
};

/**
 * Cập nhật tiến độ cho một roadmap node
 * @param {number} roadmapNodeId
 * @param {string} status - "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
 * @returns {Promise<Object>}
 */
export const updateProgress = async (roadmapNodeId, status) => {
    const res = await http.put("/api/it-path/progress", { roadmapNodeId, status });
    return res.data.data;
};
