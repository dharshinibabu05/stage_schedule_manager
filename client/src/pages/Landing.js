import React from "react";
import "./Landing.css";
import concert from "../image/concert.avif";
import stage from "../image/stage.avif";
import festival from "../image/festival.avif";
import dance from "../image/dance.avif";

const LandingPage = () => {
  return (
    <div className="landing">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-text">
          <h1>Plan Your Stage Events Easily 🎤</h1>
          <p>Manage events, stages, schedules & tasks in one place.</p>
          <button className="btn-primary">Get Started</button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>📅 Event Management</h3>
            <p>Create and manage events smoothly.</p>
          </div>
          <div className="card">
            <h3>🎭 Stage Control</h3>
            <p>Handle multiple stages without confusion.</p>
          </div>
          <div className="card">
            <h3>⏰ Scheduling</h3>
            <p>Plan accurate timelines for performances.</p>
          </div>
          <div className="card">
            <h3>✅ Task Tracking</h3>
            <p>Assign and track tasks easily.</p>
          </div>
        </div>
      </section>

      {/* EVENTS */}
<section className="events">
  <h2>Popular Events</h2>
  <div className="event-row">

    <div className="event-card">
      <img src={concert} alt="concert"/>
      <p>Music Concert</p>
    </div>

    <div className="event-card">
      <img src={stage} alt="stage"/>
      <p>Stage Show</p>
    </div>

    <div className="event-card">
      <img src={festival} alt="festival"/>
      <p>Festival Event</p>
    </div>

    <div className="event-card">
      <img src={dance} alt="dance"/>
      <p>Dance Program</p>
    </div>

  </div>
</section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Organize Your Event?</h2>
        <button className="btn-primary">Login / Register</button>
      </section>
    </div>
  );
};

export default LandingPage;