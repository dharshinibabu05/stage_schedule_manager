import { useEffect, useState } from "react";
import "./Dashboard.css";
import { getSchedules } from "../services/api";

function PerformerView() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("all");

  const stored = localStorage.getItem("user");
  const user   = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    getSchedules()
      .then(data => {
        // Filter schedules assigned to this performer (by name match or performerId)
        const mine = data.filter(s =>
          s.performerId === user?._id ||
          s.performanceName?.toLowerCase().includes(user?.firstName?.toLowerCase() || "")
        );
        // If no performer-specific match, show all (for demo purposes)
        setSchedules(mine.length > 0 ? mine : data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = filter === "all" ? schedules : schedules.filter(s => s.status === filter);

  const statusColor = {
    "on-time":   "#00ffaa",
    "delayed":   "#ff5c5c",
    "completed": "#aaa",
    "scheduled": "#4cc9f0",
  };
  const statusIcon = {
    "on-time":   "✅",
    "delayed":   "⚠️",
    "completed": "🏁",
    "scheduled": "🗓️",
  };

  // Group by event
  const grouped = filtered.reduce((acc, s) => {
    const key = s.eventId?.name || "Unknown Event";
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <h2 className="fw-bold mb-1">🎭 My Schedule</h2>
      {user && (
        <p style={{ color: "#aaa", marginBottom: "25px" }}>
          Welcome, <strong style={{ color: "#ff5cff" }}>{user.firstName} {user.lastName}</strong>
          &nbsp;— <span style={{ color: "#4cc9f0" }}>Performer</span>
        </p>
      )}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "25px", flexWrap: "wrap" }}>
        {["all", "scheduled", "on-time", "delayed", "completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 18px", borderRadius: "20px", border: "none", cursor: "pointer",
            background: filter === f
              ? "linear-gradient(135deg, #ff5cff, #7928ca)"
              : "rgba(255,255,255,0.1)",
            color: "#fff", fontWeight: filter === f ? "bold" : "normal",
            transition: "all 0.3s ease",
            textTransform: "capitalize"
          }}>
            {f === "all" ? "📋 All" : `${statusIcon[f]} ${f.replace("-", " ")}`}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: "#aaa" }}>Loading your schedule...</p>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px",
          background: "rgba(30,30,60,0.95)", borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🎭</div>
          <p style={{ color: "#aaa" }}>No performances found for this filter.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([eventName, items]) => (
          <div key={eventName} style={{ marginBottom: "30px" }}>
            <h5 style={{ color: "#4cc9f0", marginBottom: "15px" }}>📅 {eventName}</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {items.map(s => (
                <div key={s._id} style={{
                  background: "linear-gradient(145deg, rgba(50,20,80,0.95), rgba(80,10,120,0.95))",
                  borderRadius: "14px", padding: "18px 22px",
                  border: `1px solid ${statusColor[s.status] || "#fff"}44`,
                  boxShadow: `0 4px 15px ${statusColor[s.status] || "#ff5cff"}22`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  flexWrap: "wrap", gap: "12px",
                  transition: "transform 0.2s ease",
                  cursor: "default"
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateX(6px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
                >
                  <div>
                    <h6 style={{ color: "#fff", margin: 0, fontSize: "1rem" }}>
                      🎤 {s.performanceName}
                    </h6>
                    <div style={{ color: "#aaa", fontSize: "13px", marginTop: "4px" }}>
                      🎭 Stage: <span style={{ color: "#4cc9f0" }}>{s.stageId?.name || "—"}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#fff", fontWeight: "bold" }}>
                      🕐 {s.startTime} — {s.endTime}
                    </div>
                    <small style={{ color: "#aaa" }}>Duration: {
                      (() => {
                        const [sh, sm] = s.startTime.split(":").map(Number);
                        const [eh, em] = s.endTime.split(":").map(Number);
                        const diff = (eh * 60 + em) - (sh * 60 + sm);
                        return diff > 0 ? `${diff} min` : "—";
                      })()
                    }</small>
                  </div>
                  <span style={{
                    background: statusColor[s.status] || "#4cc9f0",
                    color: "#000", fontWeight: "bold", padding: "6px 14px",
                    borderRadius: "20px", fontSize: "12px"
                  }}>
                    {statusIcon[s.status]} {s.status?.replace("-", " ")?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PerformerView;