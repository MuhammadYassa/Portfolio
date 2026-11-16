import { profile } from "../data/portfolio";
import ResumeLink from "./ResumeLink";
import Reveal from "./Reveal";
export default function Hero() {
  return (
    <div className="hero shell">
      <div className="hero-topline">
        <span>
          <span className="status-dot" /> Software engineer & CS student
        </span>
        <span>Based in {profile.location}</span>
      </div>
      <Reveal>
        <h1 className="hero-name" aria-label="Muhammad Yassa">
          Muhammad
          <br />
          <span className="surname">
            {"Yassa".split("").map((letter, i) => (
              <span aria-hidden="true" key={i}>
                {letter}
              </span>
            ))}
            <span className="name-period" aria-hidden="true">
              .
            </span>
          </span>
        </h1>
      </Reveal>
      <div className="hero-bottom">
        <div>
          <p className="hero-statement">
            I build software.
            <br />
            <span>Then I figure out how to make it better.</span>
          </p>
          <p className="hero-description">
            Backend systems, full-stack applications, and the details that make
            them dependable.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#projects">
              Explore my work <span aria-hidden="true">↓</span>
            </a>
            <ResumeLink />
          </div>
        </div>
        <aside className="field-note">
          <span className="eyebrow">CURRENTLY EXPLORING</span>
          <p>What can 856,614 NYC tax lots tell us about the city?</p>
          <a href="#housing">
            Follow the data <span aria-hidden="true">↗</span>
          </a>
          <span className="note-number" aria-hidden="true">
            40.7128° N / 74.0060° W
          </span>
        </aside>
      </div>
      <div className="hero-index">
        <span>SELECTED WORK / {profile.contentYear}</span>
        <span>Built with curiosity. Refined with tests.</span>
      </div>
    </div>
  );
}
