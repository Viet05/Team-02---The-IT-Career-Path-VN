import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserState } from "../store/useLocalStorage";
import Card from "../components/Card";
import Button from "../components/Button";
import { toast } from "../components/Toast";
import { isFormValid, getValidationErrors } from "../utils/validation";
import "../styles/login.css";

import { authService } from "../services/auth";
import { saveSession } from "../services/session";

// ============================================
// TRANG ĐĂNG NHẬP
// ============================================

export default function LoginPage() {
  const navigate = useNavigate(); // Dùng để điều hướng sang trang khác (ví dụ: /hub, /admin-dashboard)
  const { login } = useUserState(); // Cập nhật thông tin user vào app state

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({ email: "admin@test.com", password: "admin" });
  const [loading, setLoading] = useState(false); // Khi true = đang gửi API, disable button
  const [errors, setErrors] = useState({ email: null, password: null }); // Lỗi validation

  // Check email verification status from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verified = params.get("verified");
    const token = params.get("token");

    if (verified === "1" && token) {
      // Gửi request xác nhận email đến backend
      authService.verifyEmail(token)
        .then(() => {
          toast.success("Xác minh email thành công! Hãy đăng nhập.");
          // Xóa URL parameters
          window.history.replaceState({}, document.title, "/auth/login");
        })
        .catch((error) => {
          const errorMessage = error?.response?.data?.message || "Email verification failed";
          toast.error(errorMessage);
        });
    }
  }, []);

  // Khi user nhập liệu vào input
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Cập nhật giá trị input
    setFormData({ ...formData, [name]: value });
    // Xóa lỗi của field này khi user bắt đầu sửa (UX tốt hơn)
    setErrors({ ...errors, [name]: null });
  };

  // Khi user bấm nút "Sign In"
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ========== BƯỚC 1: VALIDATE FORM ==========
    // Kiểm tra email và password trước khi gửi API
    const validationErrors = getValidationErrors(formData.email, formData.password);
    if (validationErrors.email || validationErrors.password) {
      // Nếu có lỗi thì hiển thị và stop
      setErrors(validationErrors);
      return;
    }
  

    // ========== BƯỚC 2: GỬI API ==========
    setLoading(true);
    setErrors({ email: null, password: null });

    try {
      
      // Gọi API đăng nhập
      const data = await authService.login(formData.email, formData.password);

      // Lấy thông tin từ response
      // data = { accessToken, tokenType, userId, userName, role }
      const token = data.accessToken;
      const roleRaw = data.role;
      const role = (roleRaw || "user").toString().toLowerCase();

      // ========== BƯỚC 3: LƯU TOKEN ==========
      // Lưu token vào localStorage để sử dụng cho các request sau
      if (token) saveSession({ token, role });

      // ========== BƯỚC 4: CẬP NHẬT APP STATE ==========
      // Cập nhật thông tin user vào app state (dùng cho navbar, profile, etc)
      login({
        name: data.userName || formData.email.split("@")[0],
        email: formData.email,
        role,
        userId: data.userId,
      });

      // ========== BƯỚC 5: THÔNG BÁO & ĐIỀU HƯỚNG ==========
      toast.success("Logged in successfully!");

      // Điều hướng theo vai trò
      if (role === "admin") navigate("/admin-dashboard"); // Admin đi đến trang quản lý
      else navigate("/hub"); // User thường đi đến trang chính
    } catch (err) {
      // ========== XỬ LÝ LỖI ==========
      // Lấy message lỗi từ backend
      const errorMessage = err?.response?.data?.message || "Login failed";
      
      // Ánh xạ lỗi backend thành message thân thiện với user
      let displayMessage = errorMessage;
      if (errorMessage.toLowerCase().includes("not found") || 
          errorMessage.toLowerCase().includes("invalid email")) {
        displayMessage = "Email does not exist";
        setErrors({ ...errors, email: "Email not found" });
      } else if (errorMessage.toLowerCase().includes("password") || 
                 errorMessage.toLowerCase().includes("incorrect")) {
        displayMessage = "Email or password is incorrect";
        setErrors({ ...errors, password: "Password is incorrect" });
      } else if (errorMessage.toLowerCase().includes("verify") || 
                 errorMessage.toLowerCase().includes("not verified")) {
        displayMessage = "Email has not been verified. Please check your inbox.";
      }
      
      // Hiển thị toast lỗi
      toast.error(displayMessage);
      // Xóa password field để bảo mật (user phải nhập lại)
      setFormData({ ...formData, password: "" });
    } finally {
      // Tắt loading state dù thành công hay thất bại
      setLoading(false);
    }
  };

  return (
    <Card className="auth-card">
      <div className="card-title">Welcome Back</div>
      <div className="card-subtitle">Sign in to continue your learning journey</div>

      <form onSubmit={handleSubmit} className="form">
        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          required
        />
        {errors.email && <span className="error-text">{errors.email}</span>}

        <label className="label">Password</label>
        <input
          className="input"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          required
        />
        {errors.password && <span className="error-text">{errors.password}</span>}

        <div className="reset">
          <Link to="/auth/forgot">Forgot password?</Link>
        </div>

        <Button 
          variant="primary" 
          fullWidth 
          type="submit" 
          disabled={loading || !isFormValid(formData.email, formData.password)}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="footer">
        Don't have an account? <Link to="/auth/signup">Sign up</Link>
      </div>
    </Card>
  );
}
