import { useEffect, useState } from "react";
import { Form, Button, Table } from "react-bootstrap";
import "./DarkPage.css";
import { getEvents, createEvent, deleteEvent } from "../services/api";

function Events() {
  const [events, setEvents]       = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue]         = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  // Load events from backend on mount
  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => setError("Failed to load events."))
      .finally(() => setLoading(false));
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !venue) return;

    try {
      const newEvent = await createEvent({ name: eventName, date: eventDate, venue });
      setEvents((prev) => [...prev, newEvent]);
      setEventName("");
      setEventDate("");
      setVenue("");
    } catch (err) {
      alert(err.message || "Failed to create event.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete event.");
    }
  };

  return (
    <div className="dark-page">
      <h2 className="mb-4">Manage Events</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Event Form */}
      <Form onSubmit={handleAddEvent} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Event Name</Form.Label>
          <Form.Control
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Enter event name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Event Date</Form.Label>
          <Form.Control
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Venue</Form.Label>
          <Form.Control
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Enter venue"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Event
        </Button>
      </Form>

      {/* Events Table */}
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <Table hover responsive className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No Events Added</td>
              </tr>
            ) : (
              events.map((event, index) => (
                <tr key={event._id}>
                  <td>{index + 1}</td>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.venue}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default Events;