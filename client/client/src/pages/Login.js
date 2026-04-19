import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { loginUser } from "../services/api";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ email, password });

      // Save JWT token + user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("isLoggedIn", "true");

      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🎭 Stage Scheduler</h2>

        {error && (
          <div style={{
            background: "rgba(255,0,0,0.2)",
            border: "1px solid red",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "15px",
            color: "#ff6b6b",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Enter Email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <input
          type="password"
          placeholder="Enter Password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button
          className="btn auth-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-3">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "#ffd700" }}
          >
            {" "}Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;