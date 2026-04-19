import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "../styles/DarkPage.css";
function Settings() {
  const [organizer, setOrganizer] = useState(
    localStorage.getItem("organizer") || ""
  );

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("organizer", organizer);
    alert("Settings Saved!");
  };

  return (
    <div className="dark-page">
      <h2 className="mb-4">Settings</h2>

      <Form onSubmit={handleSave}>
        <Form.Group className="mb-3">
          <Form.Label>Event Organizer Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter organizer name"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Save Settings
        </Button>
      </Form>
    </div>
  );
}

export default Settings;