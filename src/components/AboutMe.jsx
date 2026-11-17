import { profile, skills } from "../data/portfolio";
import Reveal from "./Reveal";
export default function AboutMe() {
  return (
    <section
      className="about-section"
      id="aboutme"
      aria-labelledby="about-title"
    >
      <div className="shell">
        <div className="about-layout">
          <Reveal className="about-copy">
            <h2 id="about-title">About Me</h2>
            {profile.about.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </Reveal>
          <Reveal className="education" delay={0.08}>
            <h2>Education</h2>
            <div className="education-mark" aria-hidden="true">
              QC<span>’27</span>
            </div>
            <h3>{profile.education.school}</h3>
            <p>{profile.education.degree}</p>
            <dl>
              <div>
                <dt>Expected graduation</dt>
                <dd>{profile.education.graduation}</dd>
              </div>
              <div>
                <dt>GPA</dt>
                <dd>{profile.education.gpa}</dd>
              </div>
            </dl>
            <p className="honors">{profile.education.honors}</p>
          </Reveal>
        </div>
        <div className="skills">
          <h2>Technical Skills</h2>
          <dl className="skills-list">
            {Object.entries(skills).map(([group, items], index) => (
              <Reveal key={group} delay={(index % 3) * 0.04}>
                <dt>{group}</dt>
                <dd>{items.join(" · ")}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
