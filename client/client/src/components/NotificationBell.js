import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "app_notifications";

// Call this from anywhere to add a notification
export function addNotification(message, type = "info") {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const newNotif = {
    id: Date.now(),
    message,
    type, // info | success | warning | danger
    time: new Date().toISOString(),
    read: false,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newNotif, ...existing].slice(0, 20)));
  // Dispatch custom event so bell updates
  window.dispatchEvent(new Event("notifications_updated"));
}

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const load = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setNotifications(stored);
  };

  useEffect(() => {
    load();
    window.addEventListener("notifications_updated", load);
    return () => window.removeEventListener("notifications_updated", load);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setNotifications(updated);
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setNotifications([]);
  };

  const typeColors = { info: "#4cc9f0", success: "#00ffaa", warning: "#f8c300", danger: "#ff5c5c" };
  const typeIcons  = { info: "ℹ️", success: "✅", warning: "⚠️", danger: "🚨" };

  const formatTime = (iso) => {
    const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return new Date(iso).toLocaleDateString();
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Bell Button */}
      <button
        onClick={() => { setOpen(o => !o); if (!open) markAllRead(); }}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "1.4rem", position: "relative", padding: "4px 8px",
          color: "#fff",
        }}
        title="Notifications"
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: "absolute", top: "-2px", right: "-2px",
            background: "#ff5cff", color: "#fff", borderRadius: "50%",
            fontSize: "10px", width: "18px", height: "18px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "bold", animation: "pulse 1.5s infinite"
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "110%", width: "320px",
          background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "14px", boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
          zIndex: 9999, overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "linear-gradient(145deg, rgba(50,20,80,0.95), rgba(80,10,120,0.95))"
          }}>
            <span style={{ color: "#ff5cff", fontWeight: "bold" }}>🔔 Notifications</span>
            {notifications.length > 0 && (
              <button onClick={clearAll} style={{
                background: "none", border: "none", color: "#aaa",
                cursor: "pointer", fontSize: "12px"
              }}>Clear all</button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#aaa" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🔕</div>
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  background: n.read ? "transparent" : "rgba(255,92,255,0.05)",
                  display: "flex", gap: "10px", alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: "1.1rem" }}>{typeIcons[n.type] || "ℹ️"}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: "#fff", fontSize: "13px" }}>{n.message}</p>
                    <small style={{ color: typeColors[n.type] || "#4cc9f0" }}>{formatTime(n.time)}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default NotificationBell;