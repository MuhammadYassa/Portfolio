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
          <h2 id="projects-title">Projects</h2>
        </div>
      </div>
      <div className="project-list">
        {projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
