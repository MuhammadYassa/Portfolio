import { experience } from "../data/portfolio";
import Reveal from "./Reveal";
export default function Experience() {
  return (
    <section
      className="experience section shell"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="section-heading">
        <h2 id="experience-title">Experience</h2>
      </div>
      <Reveal className="experience-layout">
        <div className="experience-meta">
          <p>{experience.dates}</p>
          <span>Internship · four-engineer team</span>
        </div>
        <div className="experience-entry">
          <h3>{experience.role}</h3>
          <p className="company">{experience.company}</p>
          <p className="experience-context">{experience.context}</p>
          <ul className="project-highlights">
            {experience.highlights.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
