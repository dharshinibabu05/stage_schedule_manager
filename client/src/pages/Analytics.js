import { useEffect, useState } from "react";
import "./Dashboard.css";
import { getEvents, getStages, getSchedules, getTasks } from "../services/api";

function Analytics() {
  const [events, setEvents]       = useState([]);
  const [stages, setStages]       = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getEvents(), getStages(), getSchedules(), getTasks()])
      .then(([e, st, sc, t]) => {
        setEvents(e); setStages(st); setSchedules(sc); setTasks(t);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dark-page"><p>Loading analytics...</p></div>;

  // Computed stats
  const totalEvents    = events.length;
  const totalStages    = stages.length;
  const totalSchedules = schedules.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks   = tasks.filter(t => !t.completed).length;
  const taskCompletion = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const onTime   = schedules.filter(s => s.status === "on-time").length;
  const delayed  = schedules.filter(s => s.status === "delayed").length;
  const completed = schedules.filter(s => s.status === "completed").length;
  const scheduled = schedules.filter(s => s.status === "scheduled").length;

  // Stage utilization: how many schedules per stage
  const stageUtilization = stages.map(stage => {
    const count = schedules.filter(s =>
      (s.stageId?._id || s.stageId) === stage._id
    ).length;
    return { name: stage.name, count, event: stage.eventId?.name || "—" };
  }).sort((a, b) => b.count - a.count);

  const maxUtil = Math.max(...stageUtilization.map(s => s.count), 1);

  // Events with most schedules
  const eventStats = events.map(ev => ({
    name: ev.name,
    schedules: schedules.filter(s => (s.eventId?._id || s.eventId) === ev._id).length,
    stages: stages.filter(s => (s.eventId?._id || s.eventId) === ev._id).length,
  })).sort((a, b) => b.schedules - a.schedules);

  const statCard = (icon, label, value, color) => (
    <div style={{
      background: "linear-gradient(145deg, rgba(50,20,80,0.95), rgba(80,10,120,0.95))",
      borderRadius: "18px", padding: "20px 25px", flex: "1 1 150px",
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: `0 8px 20px ${color}44`,
      textAlign: "center"
    }}>
      <div style={{ fontSize: "2rem" }}>{icon}</div>
      <div style={{ color, fontSize: "2rem", fontWeight: "bold" }}>{value}</div>
      <div style={{ color: "#aaa", fontSize: "13px" }}>{label}</div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <h2 className="fw-bold mb-1">📊 Analytics Dashboard</h2>
      <p style={{ color: "#aaa", marginBottom: "30px" }}>Overview of your event operations</p>

      {/* Top Stats */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "30px" }}>
        {statCard("📅", "Total Events",    totalEvents,    "#ff5cff")}
        {statCard("🎤", "Total Stages",    totalStages,    "#4cc9f0")}
        {statCard("🗓️", "Schedules",      totalSchedules, "#f8c300")}
        {statCard("✅", "Tasks Done",      completedTasks, "#00ffaa")}
        {statCard("⏳", "Pending Tasks",   pendingTasks,   "#ff8c00")}
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

        {/* Schedule Status Breakdown */}
        <div style={{
          background: "rgba(30,30,60,0.95)", borderRadius: "18px", padding: "25px",
          flex: "1 1 300px", border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <h5 style={{ color: "#ff5cff", marginBottom: "20px" }}>🗓️ Schedule Status</h5>
          {[
            { label: "On Time",   count: onTime,    color: "#00ffaa", icon: "✅" },
            { label: "Delayed",   count: delayed,   color: "#ff5c5c", icon: "⚠️" },
            { label: "Completed", count: completed, color: "#aaa",    icon: "🏁" },
            { label: "Scheduled", count: scheduled, color: "#4cc9f0", icon: "🗓️" },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: "#fff" }}>{item.icon} {item.label}</span>
                <span style={{ color: item.color, fontWeight: "bold" }}>{item.count}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", height: "8px" }}>
                <div style={{
                  width: `${totalSchedules ? (item.count / totalSchedules) * 100 : 0}%`,
                  background: item.color, borderRadius: "10px", height: "8px",
                  transition: "width 0.5s ease"
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Task Completion */}
        <div style={{
          background: "rgba(30,30,60,0.95)", borderRadius: "18px", padding: "25px",
          flex: "1 1 200px", border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
        }}>
          <h5 style={{ color: "#ff5cff", marginBottom: "20px" }}>✅ Task Completion</h5>
          {/* Circular progress */}
          <div style={{ position: "relative", width: "130px", height: "130px" }}>
            <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="65" cy="65" r="55" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
              <circle cx="65" cy="65" r="55" fill="none" stroke="#00ffaa" strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 55}`}
                strokeDashoffset={`${2 * Math.PI * 55 * (1 - taskCompletion / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#00ffaa" }}>{taskCompletion}%</div>
              <div style={{ fontSize: "11px", color: "#aaa" }}>Done</div>
            </div>
          </div>
          <div style={{ marginTop: "15px", textAlign: "center" }}>
            <span style={{ color: "#00ffaa" }}>✅ {completedTasks} done</span>
            <span style={{ color: "#aaa", margin: "0 8px" }}>|</span>
            <span style={{ color: "#ff8c00" }}>⏳ {pendingTasks} pending</span>
          </div>
        </div>

        {/* Stage Utilization */}
        <div style={{
          background: "rgba(30,30,60,0.95)", borderRadius: "18px", padding: "25px",
          flex: "2 1 350px", border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <h5 style={{ color: "#ff5cff", marginBottom: "20px" }}>🎤 Stage Utilization</h5>
          {stageUtilization.length === 0 ? (
            <p style={{ color: "#aaa" }}>No stage data available.</p>
          ) : stageUtilization.map((s, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: "#fff" }}>🎤 {s.name} <small style={{ color: "#aaa" }}>({s.event})</small></span>
                <span style={{ color: "#4cc9f0", fontWeight: "bold" }}>{s.count} shows</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", height: "8px" }}>
                <div style={{
                  width: `${(s.count / maxUtil) * 100}%`,
                  background: "linear-gradient(90deg, #4cc9f0, #ff5cff)",
                  borderRadius: "10px", height: "8px",
                  transition: "width 0.5s ease"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div style={{
        background: "rgba(30,30,60,0.95)", borderRadius: "18px", padding: "25px",
        marginTop: "20px", border: "1px solid rgba(255,255,255,0.1)"
      }}>
        <h5 style={{ color: "#ff5cff", marginBottom: "20px" }}>📅 Event Overview</h5>
        {eventStats.length === 0 ? (
          <p style={{ color: "#aaa" }}>No events found.</p>
        ) : (
          <table className="table table-hover" style={{ color: "#fff" }}>
            <thead style={{ background: "linear-gradient(145deg, #4b0066, #8a00cc)", color: "#fff" }}>
              <tr>
                <th>#</th><th>Event Name</th><th>Stages</th><th>Schedules</th><th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              {eventStats.map((ev, i) => (
                <tr key={i} style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                  <td>{i + 1}</td>
                  <td>{ev.name}</td>
                  <td><span style={{ color: "#4cc9f0" }}>{ev.stages}</span></td>
                  <td><span style={{ color: "#ff5cff" }}>{ev.schedules}</span></td>
                  <td>
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "10px", height: "6px", width: "100px" }}>
                      <div style={{
                        width: `${totalSchedules ? (ev.schedules / totalSchedules) * 100 : 0}%`,
                        background: "#ff5cff", borderRadius: "10px", height: "6px"
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Analytics;