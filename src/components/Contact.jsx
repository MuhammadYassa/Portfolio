import { profile } from "../data/portfolio";
export default function Contact() {
  return (
    <section
      id="contact"
      className="section shell contact"
      aria-labelledby="contact-title"
    >
      <p className="eyebrow">04 / KEEP IN TOUCH</p>
      <h2 id="contact-title">
        Have something
        <br />
        worth building<span className="accent">?</span>
      </h2>
      <div className="contact-bottom">
        <div>
          <p>
            I’d like to hear about it. For opportunities,
            <br />
            questions, or a conversation about software:
          </p>
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
