import { useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import "./Navbar.css";

function Navbar({ sidebarOpen, setSidebarOpen, onLogout }) {
  const navigate = useNavigate();
  const stored   = localStorage.getItem("user");
  const user     = stored ? JSON.parse(stored) : null;

  const roleColors = {
    admin:     "#ff5cff",
    manager:   "#4cc9f0",
    performer: "#f8c300",
    crew:      "#00ffaa",
  };

  return (
    <header className="app-navbar">
      <div className="navbar-left">
        {/* Hamburger toggle */}
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle sidebar"
        >
          <span className={`ham-line ${sidebarOpen ? "open" : ""}`} />
          <span className={`ham-line ${sidebarOpen ? "open" : ""}`} />
          <span className={`ham-line ${sidebarOpen ? "open" : ""}`} />
        </button>

        <span className="navbar-brand" onClick={() => navigate("/")}>
          🎭 StageScheduler
        </span>
      </div>

      <div className="navbar-right">
        <NotificationBell />

        {user && (
          <div className="navbar-user" onClick={() => navigate("/profile")}>
            <div className="user-avatar">
              {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user.firstName} {user.lastName}</span>
              <span
                className="user-role"
                style={{ color: roleColors[user.role] || "#ff5cff" }}
              >
                {user.role?.toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <button className="logout-btn" onClick={onLogout} title="Logout">
          ⏻
        </button>
      </div>
    </header>
  );
}

export default Navbar;