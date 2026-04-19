import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "../styles/DarkPage.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  getEvents, getStages, getSchedules,
  createSchedule, updateSchedule, deleteSchedule,
} from "../services/api";
import { addNotification } from "../components/NotificationBell";

function Schedule() {
  const [events, setEvents]                 = useState([]);
  const [stages, setStages]                 = useState([]);
  const [filteredStages, setFilteredStages] = useState([]);
  const [schedules, setSchedules]           = useState([]);
  const [selectedEvent, setSelectedEvent]   = useState("");
  const [selectedStage, setSelectedStage]   = useState("");
  const [performanceName, setPerformanceName] = useState("");
  const [startTime, setStartTime]           = useState("");
  const [endTime, setEndTime]               = useState("");
  const [loading, setLoading]               = useState(true);
  const [view, setView]                     = useState("calendar");

  useEffect(() => {
    Promise.all([getEvents(), getStages(), getSchedules()])
      .then(([eventsData, stagesData, schedulesData]) => {
        setEvents(eventsData);
        setStages(stagesData);
        setSchedules(schedulesData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      const filtered = stages.filter(
        (s) => s.eventId?._id === selectedEvent || s.eventId === selectedEvent
      );
      setFilteredStages(filtered);
      setSelectedStage("");
    } else {
      setFilteredStages([]);
    }
  }, [selectedEvent, stages]);

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !selectedStage || !performanceName || !startTime || !endTime) return;
    if (startTime >= endTime) { alert("End time must be after start time!"); return; }
    try {
      const newSchedule = await createSchedule({
        eventId: selectedEvent, stageId: selectedStage,
        performanceName, startTime, endTime,
      });
      setSchedules((prev) => [...prev, newSchedule]);
      setPerformanceName(""); setStartTime(""); setEndTime(""); setSelectedStage("");
      addNotification(`Schedule added: "${performanceName}"`, "success");
    } catch (err) {
      alert(err.message || "Failed to create schedule.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    try {
      await deleteSchedule(id);
      setSchedules((prev) => prev.filter((s) => s._id !== id));
      addNotification("Schedule deleted.", "warning");
    } catch (err) {
      alert(err.message || "Failed to delete schedule.");
    }
  };

  const calendarEvents = schedules.map((s) => {
    const date = s.eventId?.date
      ? new Date(s.eventId.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    const statusColors = {
      "on-time": "#00ffaa", "delayed": "#ff5c5c",
      "completed": "#888", "scheduled": "#4cc9f0",
    };
    return {
      id:              s._id,
      title:           "🎤 " + s.performanceName,
      start:           date + "T" + s.startTime,
      end:             date + "T" + s.endTime,
      backgroundColor: statusColors[s.status] || "#7928ca",
      borderColor:     statusColors[s.status] || "#ff5cff",
      textColor:       "#000",
      extendedProps:   { stage: s.stageId?.name, status: s.status, scheduleId: s._id },
    };
  });

  const handleEventChange = async (info) => {
    const scheduleId = info.event.extendedProps.scheduleId;
    const pad = (n) => String(n).padStart(2, "0");
    const newStart = pad(info.event.start.getHours()) + ":" + pad(info.event.start.getMinutes());
    const newEnd   = info.event.end
      ? pad(info.event.end.getHours()) + ":" + pad(info.event.end.getMinutes())
      : newStart;
    try {
      const updated = await updateSchedule(scheduleId, { startTime: newStart, endTime: newEnd });
      setSchedules((prev) => prev.map((s) => s._id === scheduleId ? { ...s, ...updated } : s));
      addNotification(info.event.title + " rescheduled to " + newStart + "-" + newEnd, "info");
    } catch (err) {
      info.revert();
      alert(err.message || "Failed to update schedule.");
    }
  };

  const handleEventClick = (info) => {
    const { stage, status } = info.event.extendedProps;
    alert(info.event.title + "\nStage: " + (stage || "-") + "\nStatus: " + status);
  };

  return (
    <div className="dark-page">
      <h2 className="mb-4">Manage Schedule</h2>

      <div style={{
        background: "rgba(30,30,60,0.95)", borderRadius: "18px",
        padding: "22px", marginBottom: "25px",
        border: "1px solid rgba(255,255,255,0.1)"
      }}>
        <h5 style={{ color: "#ff5cff", marginBottom: "16px" }}>Add Performance</h5>
        <Form onSubmit={handleAddSchedule}>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <Form.Group style={{ flex: 1 }}>
              <Form.Label>Select Event</Form.Label>
              <Form.Select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
                <option value="">-- Select Event --</option>
                {events.map((ev) => <option key={ev._id} value={ev._id}>{ev.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group style={{ flex: 1 }}>
              <Form.Label>Select Stage</Form.Label>
              <Form.Select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
                <option value="">-- Select Stage --</option>
                {filteredStages.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group style={{ flex: 1 }}>
              <Form.Label>Performance Name</Form.Label>
              <Form.Control type="text" value={performanceName}
                onChange={(e) => setPerformanceName(e.target.value)}
                placeholder="Enter performance name" />
            </Form.Group>
          </div>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginTop: "12px" }}>
            <Form.Group style={{ flex: 1 }}>
              <Form.Label>Start Time</Form.Label>
              <Form.Control type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </Form.Group>
            <Form.Group style={{ flex: 1 }}>
              <Form.Label>End Time</Form.Label>
              <Form.Control type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </Form.Group>
            <Form.Group style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
              <Button type="submit" variant="primary" style={{ width: "100%" }}>Add Schedule</Button>
            </Form.Group>
          </div>
        </Form>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["calendar", "table"].map((v) => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "8px 22px", borderRadius: "20px", border: "none", cursor: "pointer",
            background: view === v ? "linear-gradient(135deg,#ff5cff,#7928ca)" : "rgba(255,255,255,0.1)",
            color: "#fff", fontWeight: view === v ? "bold" : "normal", transition: "all 0.3s"
          }}>
            {v === "calendar" ? "Calendar View" : "Table View"}
          </button>
        ))}
      </div>

      {loading ? <p>Loading schedules...</p> : view === "calendar" ? (
        <div style={{
          background: "rgba(20,20,50,0.98)", borderRadius: "18px",
          padding: "20px", border: "1px solid rgba(255,255,255,0.1)"
        }}>
          <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "12px" }}>
            Drag to reschedule | Resize to change duration | Click for details
          </p>
          <style>{`
            .fc { color: #fff !important; }
            .fc-toolbar-title { color: #ff5cff !important; font-size: 1.2rem !important; }
            .fc-button { background: #7928ca !important; border-color: #ff5cff !important; color: #fff !important; border-radius: 8px !important; }
            .fc-button:hover { background: #ff5cff !important; }
            .fc-button-active { background: #ff5cff !important; }
            .fc-col-header-cell { background: rgba(50,20,80,0.9) !important; color: #ff5cff !important; }
            .fc-timegrid-slot { border-color: rgba(255,255,255,0.07) !important; }
            .fc-daygrid-day, .fc-timegrid-col { background: rgba(15,15,30,0.9) !important; }
            .fc-day-today { background: rgba(255,92,255,0.08) !important; }
            .fc-scrollgrid { border-color: rgba(255,255,255,0.1) !important; }
            .fc-scrollgrid td, .fc-scrollgrid th { border-color: rgba(255,255,255,0.08) !important; }
            .fc-event { border-radius: 8px !important; font-size: 12px !important; font-weight: bold !important; cursor: grab !important; }
            .fc-timegrid-slot-label { color: #aaa !important; }
            .fc-daygrid-day-number { color: #fff !important; }
          `}</style>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            events={calendarEvents}
            editable={true}
            droppable={true}
            eventResizableFromStart={true}
            eventDrop={handleEventChange}
            eventResize={handleEventChange}
            eventClick={handleEventClick}
            height="620px"
            slotMinTime="06:00:00"
            slotMaxTime="24:00:00"
            nowIndicator={true}
            allDaySlot={false}
          />
        </div>
      ) : (
        schedules.length === 0 ? <p>No Schedules Added</p> : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr><th>#</th><th>Event</th><th>Stage</th><th>Performance</th><th>Start</th><th>End</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {schedules.map((s, i) => (
                  <tr key={s._id}>
                    <td>{i + 1}</td>
                    <td>{s.eventId?.name || "Unknown"}</td>
                    <td>{s.stageId?.name || "Unknown"}</td>
                    <td>{s.performanceName}</td>
                    <td>{s.startTime}</td>
                    <td>{s.endTime}</td>
                    <td>
                      <span className={"badge bg-" + (
                        s.status === "on-time" ? "success" :
                        s.status === "delayed" ? "danger" :
                        s.status === "completed" ? "secondary" : "primary"
                      )}>{s.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}

export default Schedule;