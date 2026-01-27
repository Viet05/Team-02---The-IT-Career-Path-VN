// ============================================
// QUẢN LÝ SESSION (LƯUTRỮ TOKEN VÀO localStorage)
// ============================================

// Tên khóa dùng để lưu vào localStorage
const TOKEN_KEY = "access_token";
const ROLE_KEY = "role";

/**
 * Lưu token và role vào localStorage
 * @param {object} { token, role } - Token JWT và vai trò người dùng
 */
export const saveSession = ({ token, role }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
};

/**
 * Lấy token từ localStorage
 * @returns {string|null} Token JWT hoặc null nếu chưa login
 */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/**
 * Lấy role (vai trò) của người dùng từ localStorage
 * @returns {string|null} Role (admin/user) hoặc null
 */
export const getRole = () => localStorage.getItem(ROLE_KEY);

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa
 * @returns {boolean} true nếu có token (đã login), false nếu chưa
 */
export const isAuthed = () => Boolean(getToken());

/**
 * Xóa session (đăng xuất)
 * Xóa token và role khỏi localStorage
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};
