import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // 🔐 Check token from both storages
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // 🔥 OPTIONAL: basic token expiry check (no backend change)
  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        return <Navigate to="/admin" />;
      }
    }
  } catch (err) {
    // If token is invalid → remove it
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    return <Navigate to="/admin" />;
  }

  // ❌ No token → redirect to login
  if (!token) {
    return <Navigate to="/admin" />;
  }

  // ✅ Token exists → allow access
  return children;
}

export default ProtectedRoute;
