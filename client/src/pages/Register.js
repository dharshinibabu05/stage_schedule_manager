import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [role, setRole]           = useState("crew");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleRegister = async () => {
    setError("");

    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({ firstName, lastName, email, password, role });
      alert("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🎭 Create Account</h2>

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
          type="text"
          placeholder="First Name"
          className="form-control"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          className="form-control"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Create Password (min 6 chars)"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="form-control mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="crew">Select Role</option>
          <option value="admin">Admin</option>
          <option value="manager">Stage Manager</option>
          <option value="performer">Performer</option>
          <option value="crew">Crew Member</option>
        </select>

        <button
          className="btn auth-btn"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center mt-3">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", color: "#ffd700" }}
          >
            {" "}Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;