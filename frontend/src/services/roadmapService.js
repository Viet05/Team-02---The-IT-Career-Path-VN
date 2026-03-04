import { http } from "./http";

// ============================================
// ROADMAP SERVICE
// ============================================

/**
 * Lấy danh sách tất cả roadmaps
 * @returns {Promise<Array>} List of roadmaps
 */
export const getAllRoadmaps = async () => {
  const res = await http.get("/api/it-path/roadmaps/all");
  return res.data.data;
};

/**
 * Lấy chi tiết roadmap (bao gồm nodes và quan hệ)
 * @param {number} roadmapId - ID của roadmap
 * @param {number} userId - ID của user (for progress tracking)
 * @returns {Promise<Object>} Roadmap details with nodes
 */
export const getRoadmapDetails = async (roadmapId, userId) => {
  const res = await http.get("/api/it-path/roadmaps/details", {
    params: { roadmapId, userId },
  });
  return res.data.data;
};

/**
 * Xóa roadmap (Admin only)
 * @param {number} roadmapId - ID của roadmap cần xóa
 * @returns {Promise<string>}
 */
export const deleteRoadmap = async (roadmapId) => {
  const res = await http.delete(`/api/it-path/roadmaps/${roadmapId}`);
  return res.data.data;
};

/**
 * Cập nhật roadmap (Admin only)
 * @param {number} roadmapId
 * @param {{ title, description, level }} data
 */
export const updateRoadmap = async (roadmapId, data) => {
  const res = await http.put(`/api/it-path/roadmaps/${roadmapId}`, data);
  return res.data.data;
};
