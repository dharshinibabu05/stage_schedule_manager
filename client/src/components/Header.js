import { Navbar, Nav, Button, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Header({ isLoggedIn, setIsLoggedIn, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow">
      <Container fluid>
        {isLoggedIn && (
          <Button variant="dark" className="me-3" onClick={toggleSidebar}>
            ☰
          </Button>
        )}

        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🎭 Stage Scheduler
        </Navbar.Brand>

        <Nav className="ms-auto align-items-center gap-2">
          {!isLoggedIn ? (
            <>
              <Button as={Link} to="/login" variant="outline-light" className="me-2">Login</Button>
              <Button as={Link} to="/register" variant="light">Sign Up</Button>
            </>
          ) : (
            <>
              {/* Notification Bell */}
              <NotificationBell />

              <Dropdown align="end">
                <Dropdown.Toggle variant="light">
                  👤 {user?.firstName || "Profile"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;