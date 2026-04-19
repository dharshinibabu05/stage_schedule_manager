import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f1a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      textAlign: "center",
      padding: "40px",
    }}>
      <div style={{ fontSize: "5rem", marginBottom: "16px" }}>🎭</div>
      <h1 style={{ fontSize: "4rem", fontWeight: "800", color: "#ff5cff", margin: 0 }}>404</h1>
      <p style={{ color: "#aaa", fontSize: "1.1rem", margin: "12px 0 32px" }}>
        This page doesn't exist or you don't have access.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "12px 32px",
          borderRadius: "50px",
          background: "linear-gradient(135deg, #ff5cff, #7928ca)",
          border: "none",
          color: "#fff",
          fontWeight: "600",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
}

export default NotFound;