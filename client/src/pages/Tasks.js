import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "./DarkPage.css";
import { getTasks, createTask, updateTask, deleteTask, getStages, getUsers } from "../services/api";
import { addNotification } from "../components/NotificationBell";

function Tasks() {
  const [tasks, setTasks]       = useState([]);
  const [taskName, setTaskName] = useState("");
  const [stages, setStages]     = useState([]);
  const [crew, setCrew]         = useState([]);
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedCrew, setSelectedCrew]   = useState("");
  const [deadline, setDeadline]           = useState("");
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState("all");

  const stored = localStorage.getItem("user");
  const user   = stored ? JSON.parse(stored) : null;
  const isAdmin = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    const fetches = [getTasks()];
    if (isAdmin) {
      fetches.push(getStages(), getUsers("crew"));
    }
    Promise.all(fetches)
      .then(([tasksData, stagesData, crewData]) => {
        setTasks(tasksData);
        if (stagesData) setStages(stagesData);
        if (crewData)   setCrew(crewData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskName) return;
    try {
      const payload = {
        name: taskName,
        ...(selectedStage && { stageId: selectedStage }),
        ...(selectedCrew  && { crewId:  selectedCrew  }),
        ...(deadline      && { deadline               }),
      };
      const newTask = await createTask(payload);
      setTasks(prev => [...prev, newTask]);
      setTaskName(""); setSelectedStage(""); setSelectedCrew(""); setDeadline("");
      addNotification(`New task added: "${taskName}"`, "info");
    } catch (err) {
      alert(err.message || "Failed to add task.");
    }
  };

  const toggleTask = async (id, currentStatus) => {
    try {
      const updated = await updateTask(id, { completed: !currentStatus });
      setTasks(prev => prev.map(t => t._id === id ? updated : t));
      if (!currentStatus) addNotification(`Task completed! ✅`, "success");
    } catch (err) {
      alert(err.message || "Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete task.");
    }
  };

  // Filter tasks
  const myTasks = isAdmin ? tasks : tasks.filter(t =>
    !t.crewId || t.crewId === user?._id || t.crewId?._id === user?._id
  );
  const filtered = filter === "all"       ? myTasks
                 : filter === "pending"   ? myTasks.filter(t => !t.completed)
                 : myTasks.filter(t => t.completed);

  const pendingCount   = myTasks.filter(t => !t.completed).length;
  const completedCount = myTasks.filter(t => t.completed).length;

  return (
    <div className="dark-page">
      <h2 className="mb-2">✅ Manage Tasks</h2>
      <p style={{ color: "#aaa", marginBottom: "20px" }}>
        {pendingCount} pending · {completedCount} completed
      </p>

      {/* Add Task Form */}
      {isAdmin && (
        <div style={{
          background: "rgba(30,30,60,0.95)", borderRadius: "18px",
          padding: "20px", marginBottom: "25px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <h5 style={{ color: "#ff5cff", marginBottom: "16px" }}>➕ Add New Task</h5>
          <Form onSubmit={handleAddTask}>
            <Form.Group className="mb-3">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Sound check for Stage A"
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
              />
            </Form.Group>

            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <Form.Group style={{ flex: 1 }}>
                <Form.Label>Assign to Stage</Form.Label>
                <Form.Select value={selectedStage} onChange={e => setSelectedStage(e.target.value)}>
                  <option value="">-- No Stage --</option>
                  {stages.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group style={{ flex: 1 }}>
                <Form.Label>Assign to Crew</Form.Label>
                <Form.Select value={selectedCrew} onChange={e => setSelectedCrew(e.target.value)}>
                  <option value="">-- No Crew --</option>
                  {crew.map(c => <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group style={{ flex: 1 }}>
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                />
              </Form.Group>
            </div>

            <Button type="submit" variant="primary" className="mt-3">Add Task</Button>
          </Form>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["all", "pending", "completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "7px 18px", borderRadius: "20px", border: "none", cursor: "pointer",
            background: filter === f
              ? "linear-gradient(135deg, #ff5cff, #7928ca)"
              : "rgba(255,255,255,0.1)",
            color: "#fff", fontWeight: filter === f ? "bold" : "normal",
            textTransform: "capitalize", transition: "all 0.3s"
          }}>
            {f === "all" ? "📋 All" : f === "pending" ? "⏳ Pending" : "✅ Completed"}
            <span style={{
              marginLeft: "6px", background: "rgba(255,255,255,0.2)",
              borderRadius: "10px", padding: "0 6px", fontSize: "11px"
            }}>
              {f === "all" ? myTasks.length : f === "pending" ? pendingCount : completedCount}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "50px",
          background: "rgba(30,30,60,0.95)", borderRadius: "18px",
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📋</div>
          <p style={{ color: "#aaa" }}>No tasks here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map(task => (
            <div key={task._id} style={{
              background: task.completed
                ? "rgba(20,20,40,0.8)"
                : "linear-gradient(145deg, rgba(50,20,80,0.95), rgba(80,10,120,0.95))",
              borderRadius: "14px", padding: "16px 20px",
              border: task.completed
                ? "1px solid rgba(255,255,255,0.05)"
                : "1px solid rgba(255,92,255,0.3)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: "10px",
              opacity: task.completed ? 0.7 : 1,
              transition: "all 0.3s ease"
            }}>
              <div style={{ flex: 1, cursor: "pointer" }} onClick={() => toggleTask(task._id, task.completed)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.2rem" }}>{task.completed ? "✅" : "⬜"}</span>
                  <span style={{
                    color: task.completed ? "#aaa" : "#fff",
                    textDecoration: task.completed ? "line-through" : "none",
                    fontWeight: "500"
                  }}>
                    {task.name}
                  </span>
                </div>
                {/* Meta info */}
                <div style={{ marginTop: "6px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {task.stageId && (
                    <small style={{ color: "#4cc9f0" }}>
                      🎤 {task.stageId?.name || task.stageId}
                    </small>
                  )}
                  {task.crewId && (
                    <small style={{ color: "#f8c300" }}>
                      👷 {task.crewId?.firstName ? `${task.crewId.firstName} ${task.crewId.lastName}` : task.crewId}
                    </small>
                  )}
                  {task.deadline && (
                    <small style={{ color: new Date(task.deadline) < new Date() && !task.completed ? "#ff5c5c" : "#aaa" }}>
                      ⏰ {new Date(task.deadline).toLocaleString()}
                    </small>
                  )}
                </div>
              </div>

              {isAdmin && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;