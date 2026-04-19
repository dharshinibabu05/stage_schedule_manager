import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "../styles/DarkPage.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setFirstName(parsed.firstName || "");
      setLastName(parsed.lastName || "");
      setEmail(parsed.email || "");
    }
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const updated = { ...user, firstName, lastName, email };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (newPassword.length < 6) { setError("New password must be at least 6 characters."); return; }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("Password changed successfully!");
      setCurrentPassword(""); setNewPassword("");
    } catch (err) {
      setError(err.message || "Failed to change password.");
    }
  };

  const roleColors = { admin: "#ff5cff", manager: "#4cc9f0", performer: "#f8c300", crew: "#00ffaa" };

  return (
    <div className="dark-page">
      <h2 className="mb-4">👤 My Profile</h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error   && <Alert variant="danger">{error}</Alert>}

      {/* Profile Card */}
      {user && (
        <div style={{
          background: "linear-gradient(145deg, rgba(50,20,80,0.95), rgba(80,10,120,0.95))",
          borderRadius: "18px", padding: "25px", marginBottom: "30px",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 20px rgba(255,0,255,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "linear-gradient(135deg, #ff5cff, #4cc9f0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", fontWeight: "bold", color: "#fff",
              boxShadow: "0 0 20px rgba(255,92,255,0.5)"
            }}>
              {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
            </div>
            <div>
              <h4 style={{ color: "#fff", margin: 0 }}>{user.firstName} {user.lastName}</h4>
              <p style={{ color: "#aaa", margin: 0 }}>{user.email}</p>
              <span style={{
                background: roleColors[user.role] || "#ff5cff",
                color: "#000", fontWeight: "bold", padding: "3px 12px",
                borderRadius: "20px", fontSize: "12px", marginTop: "6px", display: "inline-block"
              }}>
                {user.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Info */}
      <div style={{
        background: "rgba(30,30,60,0.95)", borderRadius: "18px",
        padding: "25px", marginBottom: "25px",
        border: "1px solid rgba(255,255,255,0.1)"
      }}>
        <h5 style={{ color: "#ff5cff", marginBottom: "20px" }}>✏️ Edit Information</h5>
        <Form onSubmit={handleUpdateProfile}>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <Form.Group style={{ flex: 1 }}>
              <Form.Label>First Name</Form.Label>
              <Form.Control value={firstName} onChange={e => setFirstName(e.target.value)} />
            </Form.Group>
            <Form.Group style={{ flex: 1 }}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control value={lastName} onChange={e => setLastName(e.target.value)} />
            </Form.Group>
          </div>
          <Form.Group className="mt-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">Save Changes</Button>
        </Form>
      </div>

      {/* Change Password */}
      <div style={{
        background: "rgba(30,30,60,0.95)", borderRadius: "18px",
        padding: "25px", border: "1px solid rgba(255,255,255,0.1)"
      }}>
        <h5 style={{ color: "#ff5cff", marginBottom: "20px" }}>🔒 Change Password</h5>
        <Form onSubmit={handleChangePassword}>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password (min 6 chars)" />
          </Form.Group>
          <Button variant="warning" type="submit">Change Password</Button>
        </Form>
      </div>
    </div>
  );
}

export default Profile;