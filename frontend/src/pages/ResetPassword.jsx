import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "../styles/login.css";
import { confirmResetPassword } from "../services/api";

export default function ResetPassword() {
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing token.");
        }
    }, [token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token) return setError("Missing token.");
        if (newPass.length < 6) return setError("Mật khẩu tối thiểu 6 ký tự.");
        if (newPass !== confirm) return setError("Mật khẩu nhập lại không khớp.");

        try {
            setLoading(true);
            const res = await confirmResetPassword(token, newPass);
            setSuccess(res.message || "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
            setTimeout(() => {
                nav("/login", { replace: true });
            }, 2000);
        } catch (err) {
            setError(err?.message || "Lỗi khi đặt lại mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="card">
                <div className="card-title">Reset Password</div>
                <div className="card-subtitle">Set your new password.</div>

                {error && <div className="error">{error}</div>}
                {success && <div className="error" style={{ borderColor: "#28a745", color: "#28a745", backgroundColor: "#e8f5e9" }}>{success}</div>}

                <form onSubmit={handleUpdate}>
                    <label className="label">New Password</label>
                    <input
                        className="input"
                        type="password"
                        placeholder="••••••••"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                    />

                    <label className="label">Confirm Password</label>
                    <input
                        className="input"
                        type="password"
                        placeholder="••••••••"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />

                    <button className="login-btn" type="submit" disabled={loading || !token}>
                        {loading ? "Updating..." : "Update password"}
                    </button>
                </form>

                <div className="footer">
                    Back to <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
}
