import ProjectGraphic from "./ProjectGraphic";
import WatchMatePreview from "./WatchMatePreview";
export default function Project({ project }) {
  return (
    <article
      id={project.id}
      className={`project-card project-${project.id}`}
      aria-labelledby={`${project.id}-title`}
    >
      <header className="project-overview">
        <div className="project-heading-row">
          <span className="project-number" aria-hidden="true">
            {project.number}
          </span>
          <span
            className={`project-status ${project.status === "Live" ? "live" : ""}`}
          >
            {project.status === "Live" && <span className="status-dot" />}
            {project.status}
          </span>
        </div>
        <h3 id={`${project.id}-title`}>{project.name}</h3>
        <p>{project.description}</p>
      </header>
      <div className="project-visual">
        {project.id === "watchmate" ? (
          <WatchMatePreview />
        ) : (
          <ProjectGraphic id={project.id} />
        )}
      </div>
      <div className="project-content">
        {project.metrics && (
          <dl className="metrics">
            {project.metrics.map(([value, label]) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="project-detail-copy">
          <ul className="highlights">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          {project.note && <p className="project-note">{project.note}</p>}
          <ul className="tech-list" aria-label={`${project.name} technologies`}>
            {project.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          {(project.live || project.github) && (
            <div className="project-links">
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit WatchMate <span aria-hidden="true">↗</span>
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View source <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}
        </div>
        {project.id === "watchmate" && (
          <div className="project-support">
            <ProjectGraphic id="watchmate" />
          </div>
        )}
      </div>
    </article>
  );
}
