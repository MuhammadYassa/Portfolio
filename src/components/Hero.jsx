import { profile } from "../data/portfolio";
import Reveal from "./Reveal";
import KineticName from "./kinetic/KineticName";
export default function Hero() {
  return (
    <section className="hero shell" id="home" aria-labelledby="intro-title">
      <div className="hero-identity">
        <p className="eyebrow">
          <span className="location-mark" aria-hidden="true" />
          {profile.location}
        </p>
        <KineticName name={profile.name} />
        <p className="hero-role">{profile.role}</p>
      </div>
      <Reveal delay={0.1} className="hero-introduction">
        <p>{profile.introduction}</p>
        <div className="hero-actions">
          <a className="button primary" href="#projects">
            View projects <span aria-hidden="true">↓</span>
          </a>
          <a
            className="text-link resume-link"
            href={profile.resume}
            download="Muhammad-Yassa-Resume.pdf"
          >
            Download Resume <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
