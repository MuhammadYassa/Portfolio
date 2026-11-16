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
        <p className="eyebrow">03 / THE PERSON BEHIND THE CODE</p>
        <div className="about-grid">
          <div>
            <h2 id="about-title">
              Curious about
              <br />
              what’s underneath<span className="accent">.</span>
            </h2>
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <details className="personal-note">
              <summary>A small detail outside the code</summary>
              <p>
                I’m also a One Piece fan. There’s always room for one more
                chapter.
              </p>
            </details>
          </div>
          <Reveal>
            <aside className="education">
              <span className="eyebrow">LEARNING, BUILDING, REPEATING</span>
              <h3>Queens College</h3>
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
        <div className="skills-heading">
          <h3>The tools I work with</h3>
          <p>Chosen for the problem at hand.</p>
        </div>
        <dl className="skills-grid">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <dt>{category}</dt>
              <dd>{items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
