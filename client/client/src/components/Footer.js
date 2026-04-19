import "./Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <span className="footer-logo">🎭 StageScheduler</span>
        <span className="footer-copy">© 2026 Stage Schedule Manager · All Rights Reserved</span>
        <div className="footer-pulse">
          <span className="pulse-dot" />
          <span className="pulse-label">Live</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;