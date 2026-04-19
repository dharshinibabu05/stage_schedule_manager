import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { getEvents, getStages, getSchedules, getTasks } from "../services/api";
import { useSocket } from "../hooks/useSocket";

function Home() {
  const [eventCount, setEventCount]       = useState(0);
  const [stageCount, setStageCount]       = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [pendingTasks, setPendingTasks]   = useState(0);
  const [schedules, setSchedules]         = useState([]);
  const [user, setUser]                   = useState(null);

  const loadData = () => {
    Promise.all([getEvents(), getStages(), getSchedules(), getTasks()])
      .then(([events, stages, schedulesData, tasks]) => {
        setEventCount(events.length);
        setStageCount(stages.length);
        setScheduleCount(schedulesData.length);
        setPendingTasks(tasks.filter((t) => !t.completed).length);
        setSchedules(schedulesData);
      })
      .catch(console.error);
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    loadData();
  }, []);

  // Real-time: refresh dashboard on schedule changes
  useSocket({
    schedule_created: () => loadData(),
    schedule_updated: () => loadData(),
    schedule_deleted: () => loadData(),
    task_updated:     () => loadData(),
  });

  const today = new Date().toISOString().split("T")[0];
  const todaySchedules = schedules.filter((s) => {
    const eventDate = s.eventId?.date?.split("T")[0];
    return eventDate === today;
  });

  const displaySchedules = todaySchedules.length > 0 ? todaySchedules : schedules.slice(0, 5);

  return (
    <div className="dashboard-container">
      <h2 className="mb-1 fw-bold mt-0">Dashboard Overview</h2>
      {user && (
        <p style={{ color: "#aaa", marginBottom: "20px" }}>
          Welcome back, <strong style={{ color: "#ff5cff" }}>{user.firstName}</strong>!
          &nbsp;Role: <span style={{ color: "#4cc9f0" }}>{user.role}</span>
        </p>
      )}

      <div className="row">
        <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
          <div className="dashboard-card">
            <h5>Total Events</h5>
            <h3 style={{ color: "#ff5cff" }}>{eventCount}</h3>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
          <div className="dashboard-card">
            <h5>Active Stages</h5>
            <h3 style={{ color: "#4cc9f0" }}>{stageCount}</h3>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
          <div className="dashboard-card">
            <h5>Total Schedules</h5>
            <h3 style={{ color: "#f8c300" }}>{scheduleCount}</h3>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
          <div className="dashboard-card">
            <h5>Pending Tasks</h5>
            <h3 style={{ color: "#ff5c5c" }}>{pendingTasks}</h3>
          </div>
        </div>
      </div>

      <h4 className="mt-4 mb-3">
        {todaySchedules.length > 0 ? "Today's Performances" : "Upcoming Performances"}
      </h4>

      <div className="performance-list">
        {displaySchedules.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: "20px" }}>
            No performances scheduled yet.
          </p>
        ) : (
          displaySchedules.map((schedule) => (
            <div className="performance-item" key={schedule._id}>
              <div>
                <strong>{schedule.performanceName}</strong>
                <div className="text-muted" style={{ color: "#aaa", fontSize: "13px" }}>
                  {schedule.stageId?.name || "Unknown Stage"} | {schedule.startTime} - {schedule.endTime}
                </div>
              </div>
              <span className={"badge bg-" + (
                schedule.status === "on-time"   ? "success"   :
                schedule.status === "delayed"   ? "danger"    :
                schedule.status === "completed" ? "secondary" : "primary"
              )}>
                {schedule.status === "scheduled" ? "Scheduled" :
                 schedule.status === "on-time"   ? "On Time"   :
                 schedule.status === "delayed"   ? "Delayed"   : schedule.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;