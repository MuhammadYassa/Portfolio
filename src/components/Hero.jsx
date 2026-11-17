import { profile } from "../data/portfolio";
import Reveal from "./Reveal";
export default function Hero() {
  const [firstName, ...lastNames] = profile.name.split(" ");
  return (
    <section className="hero shell" id="home" aria-labelledby="intro-title">
      <Reveal className="hero-identity">
        <p className="eyebrow">
          <span className="location-mark" aria-hidden="true" />
          {profile.location}
        </p>
        <h1 id="intro-title">
          {firstName} <em>{lastNames.join(" ")}</em>
          <span className="name-period" aria-hidden="true">
            .
          </span>
        </h1>
        <p className="hero-role">{profile.role}</p>
      </Reveal>
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
