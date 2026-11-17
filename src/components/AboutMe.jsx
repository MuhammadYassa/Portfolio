import { profile, skills } from "../data/portfolio";
import Reveal from "./Reveal";

export default function AboutMe() {
  return (
    <section
      id="about"
      className="section about-section"
      aria-labelledby="about-title"
    >
      <div className="shell">
        <div className="about-grid">
          <Reveal>
            <h2 id="about-title">About Me</h2>
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal delay={0.06}>
            <aside className="education" aria-labelledby="education-title">
              <h3 id="education-title">Education</h3>
              <p className="school-name">Queens College</p>
              <p>City University of New York</p>
              <p>
                {profile.education.degree}
                <br />
                Expected {profile.education.graduation}
              </p>
              <dl>
                <div>
                  <dt>GPA</dt>
                  <dd>{profile.education.gpa}</dd>
                </div>
                <div>
                  <dt>Honors</dt>
                  <dd>{profile.education.honors}</dd>
                </div>
              </dl>
            </aside>
          </Reveal>
        </div>
        <h3 className="skills-heading">Technical Skills</h3>
        <dl className="skills-grid">
          {Object.entries(skills).map(([category, items], index) => (
            <Reveal key={category} delay={(index % 3) * 0.045}>
              <dt>{category}</dt>
              <dd>{items.join(" · ")}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
