import React, { useEffect, useRef, useState } from "react";
import "../styles/Landing.css";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "500+", label: "Events Managed" },
  { value: "1,200+", label: "Stages Coordinated" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "50+", label: "Cities Covered" },
];

const features = [
  {
    icon: "📅",
    title: "Event Management",
    desc: "Create, edit, and oversee events from a single powerful dashboard.",
  },
  {
    icon: "🎭",
    title: "Stage Control",
    desc: "Manage multiple stages simultaneously without any confusion.",
  },
  {
    icon: "⏰",
    title: "Smart Scheduling",
    desc: "Build accurate timelines with drag-and-drop precision.",
  },
  {
    icon: "✅",
    title: "Task Tracking",
    desc: "Assign, monitor, and complete tasks across your entire crew.",
  },
  {
    icon: "👥",
    title: "Role-Based Access",
    desc: "Admins, managers, performers & crew — everyone sees what they need.",
  },
  {
    icon: "📊",
    title: "Analytics",
    desc: "Get live insights into event performance and team productivity.",
  },
];

const eventTypes = [
  { emoji: "🎸", label: "Music Concert", color: "#ff5cff" },
  { emoji: "🎭", label: "Stage Show", color: "#00ffff" },
  { emoji: "🎉", label: "Festival", color: "#ffcc00" },
  { emoji: "💃", label: "Dance Program", color: "#ff6b6b" },
  { emoji: "🎤", label: "Stand-up Comedy", color: "#a8ff78" },
  { emoji: "🎻", label: "Classical Night", color: "#f093fb" },
];

const steps = [
  { num: "01", title: "Create Your Event", desc: "Set up your event in minutes with our intuitive form." },
  { num: "02", title: "Add Stages & Schedules", desc: "Define stages and build precise performance timelines." },
  { num: "03", title: "Assign Your Team", desc: "Add crew, performers, and managers with role-based access." },
  { num: "04", title: "Go Live!", desc: "Track everything in real-time on event day with zero stress." },
];

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Festival Director",
    text: "StageSchedule transformed how we manage our annual music festival. Scheduling 12 stages used to take days — now it's done in hours.",
    avatar: "🎪",
  },
  {
    name: "Priya Nair",
    role: "Event Manager",
    text: "The role-based access is a game changer. My performers only see their slots, my crew only sees their tasks. Clean and efficient.",
    avatar: "🎬",
  },
  {
    name: "Rahul Sharma",
    role: "Production Head",
    text: "Analytics alone is worth it. I can see task completion rates, late assignments, and stage gaps at a glance.",
    avatar: "📡",
  },
];

const faqs = [
  {
    q: "Is StageSchedule free to use?",
    a: "We offer a free tier for small events. For larger productions, our Pro and Enterprise plans unlock unlimited stages and advanced analytics.",
  },
  {
    q: "Can performers access their own schedule?",
    a: "Yes! Performers get a dedicated view showing only their assigned slots, stage details, and task list.",
  },
  {
    q: "How many team members can I add?",
    a: "There's no hard limit. You can add admins, managers, crew, and performers as needed.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted and stored securely. We use JWT-based auth and role-based access control throughout.",
  },
];

// ── Animated Counter ──────────────────────────────────────────────────────────
function Counter({ value }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseInt(value.replace(/\D/g, ""));
          const suffix = value.replace(/[\d]/g, "");
          let start = 0;
          const step = Math.ceil(num / 60);
          const timer = setInterval(() => {
            start += step;
            if (start >= num) {
              setDisplay(num + suffix);
              clearInterval(timer);
            } else {
              setDisplay(start + suffix);
            }
          }, 25);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{q}</span>
        <span className="faq-icon">{open ? "−" : "+"}</span>
      </div>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">

      {/* ── NAV ── */}
      <nav className="land-nav">
        <div className="land-nav-logo">🎤 StageSchedule</div>
        <div className="land-nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#testimonials">Reviews</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="land-nav-cta">
          <button className="btn-ghost" onClick={() => navigate("/login")}>Login</button>
          <button className="btn-primary" onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow glow-1" />
        <div className="hero-glow glow-2" />
        <div className="hero-content">
          <div className="hero-badge">✨ Now with Live Analytics</div>
          <h1>
            Plan Your Stage Events<br />
            <span className="hero-accent">Effortlessly.</span>
          </h1>
          <p>The all-in-one platform for events, stages, schedules, and teams. Built for directors, managers, performers, and crew.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/register")}>Sign Up</button>
            <button className="btn-ghost" onClick={() => navigate("/login")}>Sign In</button>
          </div>
          <div className="hero-trust">
            <span>⭐⭐⭐⭐⭐</span>
            <span>Trusted by 500+ event teams worldwide</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="dash-preview">
            <div className="dash-bar">
              <span className="dash-dot red" /><span className="dash-dot yellow" /><span className="dash-dot green" />
              <span className="dash-title">Live Dashboard</span>
            </div>
            <div className="dash-body">
              <div className="dash-stat-row">
                {["Events: 12", "Stages: 8", "Tasks: 34", "Crew: 20"].map(s => (
                  <div className="dash-chip" key={s}>{s}</div>
                ))}
              </div>
              <div className="dash-timeline">
                {["Stage A", "Stage B", "Stage C"].map((s, i) => (
                  <div className="tl-row" key={s}>
                    <span className="tl-label">{s}</span>
                    <div className="tl-bar-wrap">
                      <div className="tl-bar" style={{ width: `${55 + i * 15}%`, animationDelay: `${i * 0.2}s` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="dash-tasks">
                {["Sound check ✅", "Lighting setup 🔄", "Artist brief ⏳"].map(t => (
                  <div className="task-pill" key={t}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-strip">
        {stats.map(({ value, label }) => (
          <div className="stat-item" key={label}>
            <div className="stat-value"><Counter value={value} /></div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="features" id="features">
        <div className="section-label">FEATURES</div>
        <h2>Everything You Need to Run a Flawless Event</h2>
        <p className="section-sub">From pre-production to curtain call, StageSchedule has you covered.</p>
        <div className="feature-grid">
          {features.map(({ icon, title, desc }) => (
            <div className="feat-card" key={title}>
              <div className="feat-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EVENT TYPES ── */}
      <section className="event-types">
        <div className="section-label">EVENT TYPES</div>
        <h2>Built for Every Kind of Show</h2>
        <div className="type-row">
          {eventTypes.map(({ emoji, label, color }) => (
            <div className="type-card" key={label} style={{ "--accent": color }}>
              <div className="type-emoji">{emoji}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-it-works" id="how">
        <div className="section-label">HOW IT WORKS</div>
        <h2>Up and Running in 4 Simple Steps</h2>
        <div className="steps-row">
          {steps.map(({ num, title, desc }, i) => (
            <React.Fragment key={num}>
              <div className="step-card">
                <div className="step-num">{num}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              {i < steps.length - 1 && <div className="step-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials" id="testimonials">
        <div className="section-label">TESTIMONIALS</div>
        <h2>Loved by Event Professionals</h2>
        <div className="testi-row">
          {testimonials.map(({ name, role, text, avatar }) => (
            <div className="testi-card" key={name}>
              <div className="testi-avatar">{avatar}</div>
              <p className="testi-text">"{text}"</p>
              <div className="testi-name">{name}</div>
              <div className="testi-role">{role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section" id="faq">
        <div className="section-label">FAQ</div>
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map(({ q, a }) => <FAQItem key={q} q={q} a={a} />)}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta">
        <div className="cta-glow" />
        <h2>Ready to Run Your Best Event Yet?</h2>
        <p>Join hundreds of event teams who manage their shows with StageSchedule.</p>
        <div className="cta-buttons">
          <button className="btn-primary large" onClick={() => navigate("/register")}>Create Free Account →</button>
          <button className="btn-ghost" onClick={() => navigate("/login")}>Already have an account?</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="land-footer">
        <div className="footer-logo">🎤 StageSchedule</div>
        <p>© 2025 StageSchedule. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default LandingPage;