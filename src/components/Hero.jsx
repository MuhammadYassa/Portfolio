import { profile } from "../data/portfolio";
import ResumeLink from "./ResumeLink";
import Reveal from "./Reveal";
import DepthPanel from "./DepthPanel";
import WatchMatePreview from "./WatchMatePreview";
import HousingPipeline from "./HousingPipeline";

export default function Hero() {
  return (
    <div className="hero shell">
      <div className="hero-content">
        <Reveal>
          <p className="hero-location">
            <span className="location-marker" aria-hidden="true" />
            {profile.location}
          </p>
        </Reveal>
        <Reveal delay={0.04}>
          <h1 className="hero-name" aria-label="Muhammad Yassa">
            Muhammad
            <br />
            <span className="surname">
              Yassa<span className="name-period">.</span>
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="hero-role">{profile.role}</p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="hero-description">{profile.introduction}</p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="hero-actions">
            <a className="button button-dark" href="#projects">
              View Projects <span aria-hidden="true">↓</span>
            </a>
            <ResumeLink />
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.1} className="hero-showcase-reveal">
        <DepthPanel className="hero-showcase">
          <WatchMatePreview hero />
          <HousingPipeline compact />
        </DepthPanel>
      </Reveal>
    </div>
  );
}
