import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useCallback } from "react";
import Sidebar       from "./components/Sidebar";
import Navbar        from "./components/Navbar";
import Footer        from "./components/Footer";
import Home          from "./pages/Home";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import Events        from "./pages/Events";
import Stages        from "./pages/Stages";
import Schedule      from "./pages/Schedule";
import Tasks         from "./pages/Tasks";
import Settings      from "./pages/Settings";
import Landing       from "./pages/Landing";
import Profile       from "./pages/Profile";
import Analytics     from "./pages/Analytics";
import PerformerView from "./pages/PerformerView";
import NotFound      from "./pages/NotFound";

// ─── Protected Route ──────────────────────────────────────────────────────────
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

// ─── App Wrapper ──────────────────────────────────────────────────────────────
function AppWrapper() {
  const location   = useLocation();
  const [isLoggedIn,  setIsLoggedIn]  = useState(localStorage.getItem("isLoggedIn") === "true");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Public-only paths (no chrome)
  const isPublicRoute = ["/login", "/register"].includes(location.pathname);
  // Landing = "/" when not logged in
  const isLanding = location.pathname === "/" && !isLoggedIn;
  // Show dashboard chrome only when logged in and not on a public route
  const showChrome = isLoggedIn && !isPublicRoute;

  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  }, []);

  return (
    <>
      {/* ── Navbar (top bar with hamburger + notification bell) ── */}
      {showChrome && (
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />
      )}

      {/* ── Sidebar ── */}
      {showChrome && (
        <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      )}

      {/* ── Main Content ── */}
      <main
        style={{
          marginLeft:    showChrome ? (sidebarOpen ? "220px" : "60px") : "0",
          marginTop:     showChrome ? "56px" : "0",
          padding:       isLanding || isPublicRoute ? "0" : "0 24px 24px 24px",
          paddingBottom: isLanding || isPublicRoute ? "0" : "60px",
          transition:    "margin-left 0.3s ease",
          minHeight:     "100vh",
          background:    showChrome ? "#0f0f1a" : "transparent",
        }}
      >
        <Routes>
          {/* Public */}
          <Route path="/"         element={isLoggedIn ? <Home /> : <Landing />} />
          <Route path="/login"    element={isLoggedIn ? <Navigate to="/" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/" replace /> : <Register />} />

          {/* Protected – all logged-in users */}
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Protected – Performer + admin + manager */}
          <Route path="/performer" element={
            <ProtectedRoute allowedRoles={["performer", "admin", "manager"]}>
              <PerformerView />
            </ProtectedRoute>
          } />

          {/* Protected – Admin & Manager */}
          <Route path="/events" element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}><Events /></ProtectedRoute>
          } />
          <Route path="/stages" element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}><Stages /></ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}><Schedule /></ProtectedRoute>
          } />

          {/* Protected – Tasks */}
          <Route path="/tasks" element={
            <ProtectedRoute allowedRoles={["admin", "manager", "crew"]}><Tasks /></ProtectedRoute>
          } />

          {/* Protected – Admin only */}
          <Route path="/analytics" element={
            <ProtectedRoute allowedRoles={["admin"]}><Analytics /></ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={["admin"]}><Settings /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* ── Footer ── */}
      {showChrome && <Footer />}
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