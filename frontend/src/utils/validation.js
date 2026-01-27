// ============================================
// HỘP VỀ KIỂM TRA DỮ LIỆU (VALIDATION)
// ============================================

/**
 * Kiểm tra email có đúng định dạng không
 * Ví dụ: user@example.com ✓, user@example ✗
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} true nếu email hợp lệ, false nếu không
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Kiểm tra mật khẩu có đủ độ dài không
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {boolean} true nếu mật khẩu ≥ 6 ký tự, false nếu không
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Kiểm tra tên người dùng có hợp lệ không
 * @param {string} username - Tên người dùng cần kiểm tra
 * @returns {boolean} true nếu username ≥ 3 ký tự, false nếu không
 */
export const validateUsername = (username) => {
  return username && username.trim().length >= 3;
};

/**
 * Kiểm tra lỗi cho form ĐĂNG NHẬP
 * Trả về object chứa lỗi (nếu có) cho mỗi field
 * @param {string} email - Email người dùng nhập
 * @param {string} password - Mật khẩu người dùng nhập
 * @returns {object} { email: "lỗi text" hoặc null, password: "lỗi text" hoặc null }
 */
export const getValidationErrors = (email, password) => {
  const errors = { email: null, password: null };

  // Kiểm tra email
  if (!email || email.trim() === "") {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Email format is invalid";
  }

  // Kiểm tra password
  if (!password || password === "") {
    errors.password = "Password is required";
  } else if (password.length < 5) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

/**
 * Kiểm tra lỗi cho form ĐĂNG KÝ
 * Trả về object chứa lỗi (nếu có) cho mỗi field
 * @param {string} username - Tên người dùng
 * @param {string} email - Email
 * @param {string} password - Mật khẩu
 * @param {string} confirmPassword - Xác nhận mật khẩu
 * @returns {object} { username, email, password, confirmPassword }
 */
export const getSignupValidationErrors = (username, email, password, confirmPassword) => {
  const errors = { username: null, email: null, password: null, confirmPassword: null };

  // ========== Kiểm tra username ==========
  if (!username || username.trim() === "") {
    errors.username = "Username is required";
  } else if (username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  // ========== Kiểm tra email ==========
  if (!email || email.trim() === "") {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Email format is invalid";
  }

  // ========== Kiểm tra password ==========
  if (!password || password === "") {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // ========== Kiểm tra xác nhận mật khẩu ==========
  if (!confirmPassword || confirmPassword === "") {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

/**
 * Kiểm tra form ĐĂNG NHẬP có hợp lệ không
 * Dùng để disable button submit nếu form chưa valid
 * @param {string} email - Email
 * @param {string} password - Mật khẩu
 * @returns {boolean} true nếu cả email và password đều hợp lệ
 */
export const isFormValid = (email, password) => {
  const errors = getValidationErrors(email, password);
  return !errors.email && !errors.password;
};

/**
 * Kiểm tra form ĐĂNG KÝ có hợp lệ không
 * Dùng để disable button submit nếu form chưa valid
 * @param {string} username - Tên người dùng
 * @param {string} email - Email
 * @param {string} password - Mật khẩu
 * @param {string} confirmPassword - Xác nhận mật khẩu
 * @returns {boolean} true nếu tất cả field đều hợp lệ
 */
export const isSignupFormValid = (username, email, password, confirmPassword) => {
  const errors = getSignupValidationErrors(username, email, password, confirmPassword);
  return !errors.username && !errors.email && !errors.password && !errors.confirmPassword;
};
