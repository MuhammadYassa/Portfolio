import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { projects } from "../data/portfolio";

const stages = [
  {
    name: "Discover",
    detail:
      "Find official MapPLUTO releases, download the ZIP, and verify its integrity.",
    icon: "download",
  },
  {
    name: "Validate",
    detail:
      "Check dataset schemas and geospatial geometries before database ingestion.",
    icon: "check",
  },
  {
    name: "Merge",
    detail:
      "Merge staging into silver transactionally, without duplicate rows or unnecessary repeat updates.",
    icon: "database",
  },
];

function StageIcon({ type }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      {type === "download" ? (
        <>
          <path d="M16 4v15m-5-5 5 5 5-5M6 22v5h20v-5" />
          <path d="M6 9V5h6m8 0h6v4" />
        </>
      ) : type === "check" ? (
        <>
          <path d="m16 3 11 5v8c0 7-11 13-11 13S5 23 5 16V8Z" />
          <path d="m10 15 4 4 8-9" />
        </>
      ) : (
        <>
          <ellipse cx="16" cy="7" rx="11" ry="4" />
          <path d="M5 7v17c0 6 22 6 22 0V7M5 15c0 6 22 6 22 0" />
        </>
      )}
    </svg>
  );
}

export default function HousingPipeline({ compact = false }) {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const visible = useInView(ref, { once: true, amount: 0.3 });
  const project = projects.find((item) => item.id === "housing");
  if (compact)
    return (
      <a
        className="housing-mini"
        href="#housing"
        aria-label="See NYC Housing Intelligence Platform"
      >
        <span className="mini-source">
          MapPLUTO <span aria-hidden="true">→</span> PostGIS
        </span>
        <strong>
          {project.metrics[0][0]}
          <span>tax-lot records imported</span>
        </strong>
        <span className="mini-flow" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </a>
    );
  return (
    <figure
      ref={ref}
      className="project-graphic housing-graphic"
      data-visible={visible}
    >
      <figcaption className="pipeline-caption">
        <StageIcon type="database" />
        <span>MapPLUTO → PostGIS</span>
      </figcaption>
      <div className="data-count">
        {project.metrics[0][0]}
        <span>NYC tax-lot records imported</span>
      </div>
      <div className="ingestion-stages" aria-label="Implemented import stages">
        {stages.map((stage, index) => (
          <button
            type="button"
            key={stage.name}
            className="ingestion-stage"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <StageIcon type={stage.icon} />
            <span>{stage.name}</span>
            <span className="stage-step" aria-hidden="true">
              0{index + 1}
            </span>
          </button>
        ))}
      </div>
      <p className="stage-description" aria-live="polite">
        {stages[active].detail}
      </p>
      <div className="pipeline-footnote">
        <span>Transactional imports</span>
        <span>Idempotent merges</span>
      </div>
    </figure>
  );
}
