import { profile } from "../data/portfolio";
import Reveal from "./Reveal";
export default function Contact() {
  return (
    <section
      className="contact shell section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <Reveal className="contact-layout">
        <div>
          <h2 id="contact-title">Contact</h2>
          <p>For opportunities, project questions, or just to say hello.</p>
          <a className="email-link" href={`mailto:${profile.email}`}>
            {profile.email}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="contact-links">
          <a
            className="text-link"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a
            className="text-link"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a
            className="text-link"
            href={profile.resume}
            download="Muhammad-Yassa-Resume.pdf"
          >
            Resume <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
