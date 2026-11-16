import Reveal from "./Reveal";
function ProjectGraphic({ id }) {
  // Engineering diagrams, deliberately not simulated product screenshots.
  if (id === "watchmate")
    return (
      <div
        className="project-graphic watchmate-graphic"
        role="img"
        aria-label="WatchMate architecture: React interface connects to a Spring Boot API, Redis cache, MySQL database, and background TMDB imports."
      >
        <div className="graphic-heading">
          <span className="graphic-brand">
            W<span>m</span>
          </span>
          <span>WATCHMATE / SYSTEM NOTES</span>
        </div>
        <div className="architecture">
          <span className="diagram-node">React interface</span>
          <span className="diagram-line">↓</span>
          <span className="diagram-node main-node">Spring Boot API</span>
          <div className="diagram-branches">
            <span>
              Redis
              <br />
              <small>cache</small>
            </span>
            <span>
              MySQL
              <br />
              <small>persistence</small>
            </span>
            <span>
              TMDB
              <br />
              <small>async imports</small>
            </span>
          </div>
        </div>
        <div className="graphic-footer">
          <span className="status-dot" /> From “what should I watch?” to “one
          more episode.”
        </div>
      </div>
    );
  if (id === "housing")
    return (
      <div
        className="project-graphic housing-graphic"
        role="img"
        aria-label="NYC housing ingestion pipeline: discover official MapPLUTO releases, verify and validate data, then merge into PostGIS. Repeat imports produce zero duplicates."
      >
        <div className="graphic-heading">
          <span className="map-cross" aria-hidden="true">
            ⌖
          </span>
          <span>NYC / DATA FIELDNOTES</span>
        </div>
        <div className="data-count">
          856,614<span>tax lots. One reliable foundation.</span>
        </div>
        <div className="pipeline">
          <span>Discover</span>
          <b>→</b>
          <span>Validate</span>
          <b>→</b>
          <span>Merge</span>
        </div>
        <div className="graphic-footer">MapPLUTO → PostgreSQL / PostGIS</div>
      </div>
    );
  return (
    <div
      className="project-graphic renter-graphic"
      role="img"
      aria-label="Renter dispute workflow: case and evidence from both parties inform an assessment and prefilled forms for human review."
    >
      <div className="graphic-heading">
        <span className="map-cross" aria-hidden="true">
          §
        </span>
        <span>RENTER DISPUTE / WORKFLOW</span>
      </div>
      <div className="case-flow">
        <span>Case + evidence</span>
        <span aria-hidden="true">↓</span>
        <span>Assessment + filing path</span>
        <span aria-hidden="true">↓</span>
        <strong>Forms for human review</strong>
      </div>
      <div className="graphic-footer">
        Structured assistance. Nonbinding assessments.
      </div>
    </div>
  );
}
export default function Project({ project }) {
  return (
    <Reveal>
      <article
        id={project.id}
        className={`project-card project-${project.id}`}
        aria-labelledby={`${project.id}-title`}
      >
        <div className="project-visual">
          <ProjectGraphic id={project.id} />
          <p className="visual-caption">
            Engineering diagram · not a product screenshot
          </p>
        </div>
        <div className="project-content">
          <div className="project-kicker">
            <span>PROJECT {project.number}</span>
            <span
              className={`project-status ${project.status === "Live" ? "live" : ""}`}
            >
              {project.status === "Live" && <span className="status-dot" />}
              {project.status}
            </span>
          </div>
          <h3 id={`${project.id}-title`}>{project.name}</h3>
          <p className="project-subtitle">{project.subtitle}</p>
          <p>{project.description}</p>
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
      </article>
    </Reveal>
  );
}
