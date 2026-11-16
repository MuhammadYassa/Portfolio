import Project from "./Project";
import { projects } from "../data/portfolio";
export default function Projects() {
  return (
    <section
      id="projects"
      className="section shell"
      aria-labelledby="projects-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / SELECTED WORK</p>
          <h2 id="projects-title">
            A few things I’ve built<span className="accent">.</span>
          </h2>
        </div>
        <p>
          Real projects. Interesting problems.
          <br />A closer look under the hood.
        </p>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
