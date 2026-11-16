import { experience } from "../data/portfolio";
import Reveal from "./Reveal";
export default function Experience() {
  return (
    <section
      id="experience"
      className="section shell"
      aria-labelledby="experience-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">02 / EXPERIENCE</p>
          <h2 id="experience-title">
            Shipping with a team<span className="accent">.</span>
          </h2>
        </div>
      </div>
      <Reveal>
        <article className="experience-entry">
          <div>
            <span className="eyebrow">{experience.dates}</span>
            <h3>{experience.role}</h3>
            <p className="company">{experience.company}</p>
          </div>
          <div>
            <p>{experience.context}</p>
            <ul className="highlights">
              {experience.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
