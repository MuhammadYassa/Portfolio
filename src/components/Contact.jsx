import { profile } from "../data/portfolio";
export default function Contact() {
  return (
    <section
      id="contact"
      className="section shell contact"
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title">Contact</h2>
      <div className="contact-bottom">
        <div>
          <p>For opportunities or questions about my work, send me an email.</p>
          <a className="email-link" href={`mailto:${profile.email}`}>
            {profile.email} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="social-links">
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
        </div>
      </div>
    </section>
  );
}
