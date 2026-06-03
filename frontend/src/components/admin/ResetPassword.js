import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirm) {
      setError("Fill all fields");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/admin/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setMessage("Password updated successfully ✅");

        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        setError(data.message || "Reset failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleReset} style={cardStyle}>
        <h2 style={titleStyle}>Reset Password</h2>

        {error && <p style={errorStyle}>{error}</p>}
        {message && <p style={successStyle}>{message}</p>}

        <div style={inputWrapStyle}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <span onClick={() => setShowPassword(!showPassword)} style={eyeStyle}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div style={inputWrapStyle}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={inputStyle}
          />
          <span onClick={() => setShowConfirm(!showConfirm)} style={eyeStyle}>
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        <button disabled={loading} style={buttonStyle}>
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

/* 🎨 STYLES */
const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
};

const cardStyle = {
  width: "340px",
  background: "#1e293b",
  padding: "40px",
  borderRadius: "14px",
};

const titleStyle = {
  color: "#fff",
  textAlign: "center",
  marginBottom: "20px",
};

const inputWrapStyle = {
  position: "relative",
  marginBottom: "15px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 40px 12px 12px",
  borderRadius: "6px",
  border: "none",
  boxSizing: "border-box",
};

const eyeStyle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "18px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#22c55e",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  fontWeight: "bold",
};

const errorStyle = { color: "#f87171", textAlign: "center" };
const successStyle = { color: "#4ade80", textAlign: "center" };

export default ResetPassword;
