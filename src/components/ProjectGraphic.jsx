import { useState } from "react";
import HousingPipeline from "./HousingPipeline";
export default function ProjectGraphic({ id }) {
  const [trace, setTrace] = useState(0);
  // Engineering diagrams, deliberately not simulated product screenshots.
  if (id === "watchmate")
    return (
      <figure
        className="project-graphic watchmate-graphic"
        aria-label="WatchMate architecture"
      >
        <div className="graphic-heading">
          <span className="graphic-brand">
            W<span>m</span>
          </span>
          <span>Architecture</span>
        </div>
        <div key={trace} className={`architecture ${trace ? "trace-run" : ""}`}>
          <span className="diagram-node trace-client">React interface</span>
          <span className="diagram-line" aria-hidden="true">
            ↓
          </span>
          <span className="diagram-node main-node trace-api">
            Spring Boot API
          </span>
          <div className="diagram-branches">
            <span className="trace-cache">
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
              Background jobs
              <br />
              <small>TMDB imports</small>
            </span>
          </div>
        </div>
        <p className="diagram-description" aria-live="polite">
          {trace
            ? "Cached request: React → API → Redis → API → React."
            : "Cached movie-detail requests use Redis. Imports run separately in the background."}
        </p>
        <button
          type="button"
          className="trace-button"
          onClick={() => setTrace((value) => value + 1)}
        >
          Trace cached request <span aria-hidden="true">→</span>
        </button>
      </figure>
    );
  if (id === "housing") return <HousingPipeline />;
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
        <span>Case workflow</span>
      </div>
      <div className="case-flow">
        <span>Case + evidence</span>
        <span aria-hidden="true">↓</span>
        <span>Assessment + filing path</span>
        <span aria-hidden="true">↓</span>
        <strong>Forms for human review</strong>
      </div>
      <div className="graphic-footer">
        Assessments are nonbinding. Forms are prepared for review.
      </div>
    </div>
  );
}
