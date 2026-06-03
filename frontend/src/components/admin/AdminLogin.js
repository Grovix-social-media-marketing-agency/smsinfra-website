import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.lamp-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 48px;
  background: #131c27;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
}

.lamp-glow-bg {
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 600px; height: 420px;
  background: radial-gradient(ellipse at top, rgba(255,180,40,0.22) 0%, transparent 65%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.9s ease;
}
.lamp-glow-bg.on { opacity: 1; }

.lamp-scene {
  position: relative;
  width: 220px;
  height: 260px;
  flex-shrink: 0;
}

.lamp-shade {
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 152px; height: 102px;
  background: linear-gradient(170deg, #2e3038 0%, #1a1c22 60%, #111318 100%);
  clip-path: polygon(16% 0%, 84% 0%, 100% 100%, 0% 100%);
  border-radius: 0 0 4px 4px;
  transition: background 0.6s, filter 0.6s;
}
.lamp-shade.on {
  background: linear-gradient(170deg, #3d2c08 0%, #261c04 60%, #1a1200 100%);
  filter: drop-shadow(0 0 22px rgba(255,175,30,0.9)) drop-shadow(0 0 55px rgba(255,155,10,0.45));
}
.lamp-shade-glow {
  position: absolute;
  bottom: 0; left: 10%;
  width: 80%; height: 55%;
  background: radial-gradient(ellipse, rgba(255,210,70,0.45) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.7s;
}
.lamp-shade.on .lamp-shade-glow { opacity: 1; }

.lamp-eyes {
  position: absolute;
  top: 38px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 22px;
}
.lamp-eye {
  width: 18px; height: 11px;
  background: #0d0f14;
  border-radius: 0 0 12px 12px;
  transition: background 0.4s, box-shadow 0.4s, height 0.1s;
}
.lamp-eye.on {
  background: #fbbf24;
  box-shadow: 0 0 8px #fbbf24, 0 0 20px rgba(251,191,36,0.55);
}
.lamp-eye.blink { height: 2px; }

.lamp-rim-top {
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: 90px; height: 13px;
  background: #252830;
  border-radius: 5px 5px 0 0;
  border: 1px solid #333640;
}
.lamp-rim-bot {
  position: absolute;
  top: 99px; left: 50%;
  transform: translateX(-50%);
  width: 152px; height: 13px;
  background: #1c1e26;
  border-radius: 0 0 5px 5px;
  border: 1px solid #2a2c34;
  transition: background 0.5s;
}
.lamp-rim-bot.on { background: #231900; }

.lamp-stem {
  position: absolute;
  top: 112px; left: 50%;
  transform: translateX(-50%);
  width: 14px; height: 78px;
  background: linear-gradient(to right, #454545, #909090, #454545);
  border-radius: 3px;
}
.lamp-base {
  position: absolute;
  top: 186px; left: 50%;
  transform: translateX(-50%);
  width: 84px; height: 14px;
  background: linear-gradient(to bottom, #6a6a6a, #3a3a3a);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.7);
}
.lamp-base-shadow {
  position: absolute;
  top: 201px; left: 50%;
  transform: translateX(-50%);
  width: 108px; height: 10px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%);
  border-radius: 50%;
}
.lamp-floor-glow {
  position: absolute;
  top: 206px; left: 50%;
  transform: translateX(-50%);
  width: 170px; height: 14px;
  background: radial-gradient(ellipse, rgba(255,175,40,0.28) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.7s;
}
.lamp-floor-glow.on { opacity: 1; }

/* CORD */
.lamp-cord {
  position: absolute;
  top: 102px;
  left: calc(50% - 56px);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  z-index: 20;
  transform-origin: top center;
  user-select: none;
}
@keyframes lampSway {
  0%,100% { transform: rotate(0deg); }
  30%      { transform: rotate(5deg); }
  70%      { transform: rotate(-5deg); }
}
.lamp-cord.sway { animation: lampSway 2.2s ease-in-out infinite; }

.lamp-cord-line {
  width: 2px;
  height: 52px;
  background: linear-gradient(to bottom, #8a8a8a, #c0c0c0);
  border-radius: 1px;
  transition: height 0.15s ease;
}
.lamp-cord-knot {
  width: 11px; height: 11px;
  background: radial-gradient(circle at 35% 35%, #c0c0c0, #606060);
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
  margin-top: 2px;
}
.lamp-cord-tassel {
  width: 6px; height: 14px;
  background: linear-gradient(to bottom, #aaa, #777);
  border-radius: 0 0 3px 3px;
}
.lamp-cord-hint {
  margin-top: 6px;
  font-size: 10px;
  color: rgba(255,255,255,0.3);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  white-space: nowrap;
  animation: lampHintPulse 2s ease-in-out infinite;
}
@keyframes lampHintPulse {
  0%,100% { opacity: 0.3; }
  50%      { opacity: 0.65; }
}

/* FORM */
.lamp-form-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
}
@keyframes lampFormDrop {
  from { opacity: 0; transform: translateY(-22px) scale(0.97); }
  to   { opacity: 1; transform: none; }
}
.lamp-form-wrap {
  width: 100%;
  max-width: 340px;
  padding: 0 16px;
  animation: lampFormDrop 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
}
`;

function injectStyle() {
  if (document.getElementById("lamp-login-style")) return;
  const s = document.createElement("style");
  s.id = "lamp-login-style";
  s.textContent = STYLES;
  document.head.appendChild(s);
}

function AdminLogin() {
  const navigate = useNavigate();
  injectStyle();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [lampOn, setLampOn]           = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [eyeBlink, setEyeBlink]       = useState(false);
  const [pulling, setPulling]         = useState(false);
  const [cordH, setCordH]             = useState(52);

  const startYRef = useRef(0);
  const cordRef   = useRef(null);

  /* blink eyes */
  useEffect(() => {
    if (!lampOn) return;
    const id = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3400);
    return () => clearInterval(id);
  }, [lampOn]);

  /* mouse drag on cord — turnOn defined inside to satisfy exhaustive-deps */
  useEffect(() => {
    const cord = cordRef.current;
    if (!cord || lampOn) return;

    const turnOn = () => {
      setPulling(true);
      setCordH(90);
      setTimeout(() => {
        setCordH(52);
        setTimeout(() => {
          setPulling(false);
          setLampOn(true);
          setTimeout(() => setFormVisible(true), 450);
        }, 180);
      }, 280);
    };

    const onMouseDown = (e) => {
      startYRef.current = e.clientY;
      const onMove = (ev) => {
        const dy = ev.clientY - startYRef.current;
        if (dy > 0) setCordH(Math.min(52 + dy, 95));
        if (dy > 38) {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          turnOn();
        }
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        if (!lampOn) setCordH(52);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    const onTouchStart = (e) => {
      startYRef.current = e.touches[0].clientY;
      const onMove = (ev) => {
        const dy = ev.touches[0].clientY - startYRef.current;
        if (dy > 0) setCordH(Math.min(52 + dy, 95));
        if (dy > 38) {
          cord.removeEventListener("touchmove", onMove);
          cord.removeEventListener("touchend", onUp);
          turnOn();
        }
      };
      const onUp = () => {
        cord.removeEventListener("touchmove", onMove);
        cord.removeEventListener("touchend", onUp);
        if (!lampOn) setCordH(52);
      };
      cord.addEventListener("touchmove", onMove, { passive: true });
      cord.addEventListener("touchend", onUp);
    };

    cord.addEventListener("mousedown", onMouseDown);
    cord.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => {
      cord.removeEventListener("mousedown", onMouseDown);
      cord.removeEventListener("touchstart", onTouchStart);
    };
  }, [lampOn]);

  /* ── original handlers ── */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill all fields"); return; }
    try {
      setLoading(true);
      const res = await fetch("https://smsinfra-website.onrender.com/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.token) {
        (form.remember ? localStorage : sessionStorage).setItem("token", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) { setError("Enter your email first"); return; }
    try {
      setLoading(true);
      const res = await fetch("https://smsinfra-website.onrender.com/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      alert(data.message || "Reset link sent (check backend console)");
    } catch (err) {
      setError("Error sending reset request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lamp-page">

      {/* ambient glow */}
      <div className={`lamp-glow-bg ${lampOn ? "on" : ""}`} />

      {/* ── LAMP ── */}
      <div className="lamp-scene">
        <div className="lamp-rim-top" />

        <div className={`lamp-shade ${lampOn ? "on" : ""}`}>
          <div className="lamp-shade-glow" />
          <div className="lamp-eyes">
            <div className={`lamp-eye ${lampOn ? "on" : ""} ${eyeBlink ? "blink" : ""}`} />
            <div className={`lamp-eye ${lampOn ? "on" : ""} ${eyeBlink ? "blink" : ""}`} />
          </div>
        </div>

        <div className={`lamp-rim-bot ${lampOn ? "on" : ""}`} />
        <div className="lamp-stem" />
        <div className="lamp-base" />
        <div className="lamp-base-shadow" />
        <div className={`lamp-floor-glow ${lampOn ? "on" : ""}`} />

        {/* pull cord */}
        {!lampOn && (
          <div
            ref={cordRef}
            className={`lamp-cord ${!pulling ? "sway" : ""}`}
          >
            <div className="lamp-cord-line" style={{ height: cordH + "px" }} />
            <div className="lamp-cord-knot" />
            <div className="lamp-cord-tassel" />
            <div className="lamp-cord-hint">pull cord</div>
          </div>
        )}
      </div>

      {/* ── LOGIN FORM — only visible after lamp pulled ── */}
      {formVisible && (
        <div className="lamp-form-area">
          <div className="lamp-form-wrap">
            <form
              onSubmit={handleLogin}
              style={{
                width: "100%",
                background: "#1e293b",
                padding: "40px",
                borderRadius: "14px",
                boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
              }}
            >
              <h2 style={{ color: "#fff", textAlign: "center", marginBottom: "25px" }}>
                Admin Panel
              </h2>

              {error && (
                <div style={{ background: "#7f1d1d", color: "#fecaca", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <input
                type="email" name="email"
                placeholder="Email"
                value={form.email} onChange={handleChange}
                style={inputStyle}
              />

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password} onChange={handleChange}
                  style={inputStyle}
                />
                <span onClick={() => setShowPassword(!showPassword)} style={toggleStyle}>
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", fontSize: "13px", color: "#cbd5f5" }}>
                <label>
                  <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />{" "}
                  Remember me
                </label>
                <span style={{ cursor: "pointer", color: "#38bdf8" }} onClick={handleForgotPassword}>
                  Forgot password?
                </span>
              </div>

              <button
                type="submit" disabled={loading}
                style={{ width: "100%", marginTop: "20px", padding: "12px", background: "#f59e0b", border: "none", borderRadius: "6px", color: "#fff", fontWeight: "bold", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px", marginBottom: "15px",
  borderRadius: "6px", border: "none", outline: "none",
};

const toggleStyle = {
  position: "absolute", right: "10px", top: "12px",
  cursor: "pointer", fontSize: "12px", color: "#94a3b8",
};

export default AdminLogin;
