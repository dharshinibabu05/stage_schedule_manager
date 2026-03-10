import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Header       from "./components/Header";
import Sidebar      from "./components/Sidebar";
import Footer       from "./components/Footer";
import Home         from "./pages/Home";
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Events       from "./pages/Events";
import Stages       from "./pages/Stages";
import Schedule     from "./pages/Schedule";
import Tasks        from "./pages/Tasks";
import Settings     from "./pages/Settings";
import Landing      from "./pages/Landing";
import Profile      from "./pages/Profile";
import Analytics    from "./pages/Analytics";
import PerformerView from "./pages/PerformerView";

// ─── Protected Route ─────────────────────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (allowedRoles) {
    const stored = localStorage.getItem("user");
    const user   = stored ? JSON.parse(stored) : null;
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }
  return children;
}

// ─── App Wrapper ─────────────────────────────────────────────────────────────
function AppWrapper() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const hideHeaderRoutes = ["/login", "/register"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  const toggleSidebar    = () => setSidebarOpen(prev => !prev);

  return (
    <>
      {!shouldHideHeader && (
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} toggleSidebar={toggleSidebar} />
      )}

      {isLoggedIn && !shouldHideHeader && <Sidebar isOpen={sidebarOpen} />}

      <div
        className="main-content"
        style={{
          marginTop:   !shouldHideHeader ? "56px" : "0",
          marginLeft:  isLoggedIn && !shouldHideHeader ? (sidebarOpen ? "220px" : "60px") : "0",
          padding:     "0 20px 20px 20px",
          paddingBottom: "60px",
          transition:  "margin-left 0.3s ease",
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/"         element={isLoggedIn ? <Home /> : <Landing />} />
          <Route path="/login"    element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected – All logged-in users */}
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Protected – Performer only */}
          <Route path="/performer" element={
            <ProtectedRoute allowedRoles={["performer", "admin", "manager"]}>
              <PerformerView />
            </ProtectedRoute>
          } />

          {/* Protected – Admin & Manager */}
          <Route path="/events" element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <Events />
            </ProtectedRoute>
          } />
          <Route path="/stages" element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <Stages />
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <Schedule />
            </ProtectedRoute>
          } />

          {/* Protected – Tasks (admin, manager, crew) */}
          <Route path="/tasks" element={
            <ProtectedRoute allowedRoles={["admin", "manager", "crew"]}>
              <Tasks />
            </ProtectedRoute>
          } />

          {/* Protected – Admin only */}
          <Route path="/analytics" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!shouldHideHeader && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}