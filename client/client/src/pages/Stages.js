import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "../styles/DarkPage.css";
import { getEvents, getStages, createStage, deleteStage } from "../services/api";

function Stages() {
  const [stages, setStages]               = useState([]);
  const [events, setEvents]               = useState([]);
  const [stageName, setStageName]         = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [capacity, setCapacity]           = useState("");
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    Promise.all([getEvents(), getStages()])
      .then(([eventsData, stagesData]) => {
        setEvents(eventsData);
        setStages(stagesData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddStage = async (e) => {
    e.preventDefault();
    if (!stageName || !selectedEvent) return;

    try {
      const newStage = await createStage({
        name: stageName,
        eventId: selectedEvent,
        capacity: capacity || 0,
      });
      setStages((prev) => [...prev, newStage]);
      setStageName("");
      setSelectedEvent("");
      setCapacity("");
    } catch (err) {
      alert(err.message || "Failed to create stage.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this stage?")) return;
    try {
      await deleteStage(id);
      setStages((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete stage.");
    }
  };

  return (
    <div className="dark-page">
      <h2 className="mb-4">Manage Stages</h2>

      <Form onSubmit={handleAddStage}>
        <Form.Group className="mb-3">
          <Form.Label>Stage Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter stage name"
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Capacity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter capacity (optional)"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Event</Form.Label>
          <Form.Select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="">-- Select Event --</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary">
          Add Stage
        </Button>
      </Form>

      <hr className="my-4" />
      <h4>Stage List</h4>

      {loading ? (
        <p>Loading stages...</p>
      ) : stages.length === 0 ? (
        <p>No Stages Added</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Stage Name</th>
                <th>Capacity</th>
                <th>Event</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage, index) => (
                <tr key={stage._id}>
                  <td>{index + 1}</td>
                  <td>{stage.name}</td>
                  <td>{stage.capacity || "—"}</td>
                  <td>{stage.eventId?.name || "Unknown"}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(stage._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Stages;