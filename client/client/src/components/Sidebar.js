import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen }) {
  // Get user role from localStorage
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;
  const role = user?.role || "crew";

  // Role-based menu config
  const allMenuItems = [
    { to: "/",           label: "Dashboard",    icon: "🏠", roles: ["admin", "manager", "performer", "crew"] },
    { to: "/events",     label: "Events",       icon: "📅", roles: ["admin", "manager"] },
    { to: "/stages",     label: "Stages",       icon: "🎤", roles: ["admin", "manager"] },
    { to: "/schedule",   label: "Schedule",     icon: "🗓️", roles: ["admin", "manager"] },
    { to: "/performer",  label: "My Schedule",  icon: "🎭", roles: ["performer"] },
    { to: "/tasks",      label: "Tasks",        icon: "✅", roles: ["admin", "manager", "crew"] },
    { to: "/analytics",  label: "Analytics",    icon: "📊", roles: ["admin"] },
    { to: "/profile",    label: "Profile",      icon: "👤", roles: ["admin", "manager", "performer", "crew"] },
    { to: "/settings",   label: "Settings",     icon: "⚙️", roles: ["admin"] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {isOpen && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h5 style={{ margin: 0, color: "#ff5cff" }}>Menu</h5>
          <small style={{ color: "#aaa", fontSize: "11px" }}>{role?.toUpperCase()}</small>
        </div>
      )}
      <nav className="nav flex-column">
        {menuItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            title={!isOpen ? item.label : ""}
          >
            {isOpen ? `${item.icon} ${item.label}` : item.icon}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;