import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/api";
import "../styles/login.css"; // Reuse login styles for consistency

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Không tìm thấy token xác thực.");
            return;
        }

        verifyEmail(token)
            .then((res) => {
                setStatus("success");
                setMessage(res.data || "Xác thực email thành công!");
                setTimeout(() => navigate("/login"), 3000); // Redirect after 3s
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err.message || "Xác thực thất bại. Token có thể đã hết hạn.");
            });
    }, [token, navigate]);

    return (
        <div className="page">
            <div className="card">
                <div className="card-title">Xác thực Email</div>

                <div className="card-body" style={{ textAlign: "center", padding: "20px 0" }}>
                    {status === "verifying" && (
                        <div>
                            <div className="spinner" style={{ margin: "0 auto 20px" }}></div>
                            <p>Đang xác thực...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div style={{ color: "#28a745" }}>
                            <h3 style={{ marginBottom: "10px" }}>Thành công!</h3>
                            <p>{message}</p>
                            <p>Đang chuyển hướng về trang đăng nhập...</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div style={{ color: "#dc3545" }}>
                            <h3 style={{ marginBottom: "10px" }}>Lỗi!</h3>
                            <p>{message}</p>
                            <Link to="/login" className="login-btn" style={{ display: "inline-block", marginTop: "20px", textDecoration: "none" }}>
                                Về trang đăng nhập
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
