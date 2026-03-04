import { http } from "./http";

// ============================================
// JOB POSTING SERVICE
// ============================================

/**
 * Lấy danh sách việc làm với tìm kiếm và filter
 * @param {Object} filters - { keyword, location, jobType, jobLevel, skillId, minSalary, maxSalary }
 * @returns {Promise<Array>}
 */
export const getAllJobs = async (filters = {}) => {
    const params = {};
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.location) params.location = filters.location;
    if (filters.jobType) params.jobType = filters.jobType;
    if (filters.jobLevel) params.jobLevel = filters.jobLevel;
    if (filters.skillId) params.skillId = filters.skillId;
    if (filters.minSalary !== undefined && filters.minSalary !== "") params.minSalary = filters.minSalary;
    if (filters.maxSalary !== undefined && filters.maxSalary !== "") params.maxSalary = filters.maxSalary;

    const res = await http.get("/api/it-path/jobs", { params });
    return res.data.data;
};

/**
 * Lấy chi tiết việc làm theo ID
 * @param {number|string} id - ID của việc làm
 * @returns {Promise<Object>}
 */
export const getJobById = async (id) => {
    const res = await http.get(`/api/it-path/jobs/${id}`);
    return res.data.data;
};

/**
 * Lấy danh sách việc làm yêu thích của user hiện tại
 * Yêu cầu đăng nhập
 * @returns {Promise<Array>}
 */
export const getFavouriteJobs = async () => {
    const res = await http.get("/api/it-path/jobs/favourite");
    return res.data.data;
};

/**
 * Thêm việc làm vào danh sách yêu thích
 * @param {number} jobPostingId - ID của job posting
 * @returns {Promise<Object>}
 */
export const addFavouriteJob = async (jobPostingId) => {
    const res = await http.post("/api/it-path/jobs/favourite", { jobPostingId });
    return res.data.data;
};

/**
 * Xóa việc làm khỏi danh sách yêu thích
 * @param {number} userFavouriteJobId - ID của bản ghi yêu thích (không phải job ID)
 * @returns {Promise<void>}
 */
export const removeFavouriteJob = async (userFavouriteJobId) => {
    await http.delete(`/api/it-path/jobs/favourite/${userFavouriteJobId}`);
};
