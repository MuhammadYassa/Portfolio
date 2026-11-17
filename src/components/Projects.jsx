import { useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { projects } from "../data/portfolio";
import Reveal from "./Reveal";
function ProjectLinks({ project }) {
  return (
    <div className="project-links">
      {project.live && (
        <a
          className="text-link"
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit WatchMate <span aria-hidden="true">↗</span>
        </a>
      )}
      <a
        className="text-link"
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
function Technologies({ items }) {
  return (
    <ul className="technologies" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
function ScreenshotViewer() {
  const [device, setDevice] = useState("desktop");
  const dialog = useRef(null);
  const reduced = useReducedMotion();
  const src = `/projects/watchmate-${device}.jpg`;
  return (
    <div className="screenshot-showcase">
      <div className="preview-toolbar">
        <span className="preview-domain">
          <span className="live-dot" aria-hidden="true" />
          mywatchmate.us
        </span>
        <div
          className="device-controls"
          role="group"
          aria-label="WatchMate screenshot size"
        >
          {["desktop", "mobile"].map((size) => (
            <button
              key={size}
              aria-pressed={device === size}
              onClick={() => setDevice(size)}
            >
              {size === "desktop" ? "Desktop" : "Mobile"}
            </button>
          ))}
        </div>
      </div>
      <button
        className={`screenshot-stage ${device}`}
        onClick={() => dialog.current.showModal()}
        aria-label={`Enlarge WatchMate ${device} screenshot`}
      >
        <AnimatePresence initial={false} mode="sync">
          <m.img
            key={device}
            src={src}
            width={device === "desktop" ? 1440 : 390}
            height={device === "desktop" ? 900 : 844}
            alt={`WatchMate public homepage on ${device}, with movie discovery and navigation`}
            initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
          />
        </AnimatePresence>
        <span className="enlarge-hint" aria-hidden="true">
          View screenshot ↗
        </span>
      </button>
      <p className="image-caption">
        Actual WatchMate homepage <span>Desktop & mobile</span>
      </p>
      <dialog
        ref={dialog}
        className="screenshot-dialog"
        aria-labelledby="screenshot-title"
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="dialog-toolbar">
          <h4 id="screenshot-title">WatchMate · {device} screenshot</h4>
          <button
            onClick={() => dialog.current.close()}
            aria-label="Close screenshot"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <img
          src={src}
          alt={`Full WatchMate ${device} public homepage screenshot`}
          width={device === "desktop" ? 1440 : 390}
          height={device === "desktop" ? 900 : 844}
        />
      </dialog>
    </div>
  );
}
function CacheBenchmark({ project }) {
  const reduced = useReducedMotion();
  const { uncachedMs, cachedMs } = project.benchmark;
  return (
    <figure className="benchmark" aria-labelledby="benchmark-title">
      <figcaption id="benchmark-title">
        Movie-detail retrieval <span>Redis benchmark</span>
      </figcaption>
      {[
        ["Without cache", uncachedMs, 1],
        ["With Redis", cachedMs, cachedMs / uncachedMs],
      ].map(([label, value, scale]) => (
        <div className="benchmark-row" key={label}>
          <span>{label}</span>
          <div className="benchmark-track">
            <m.div
              className="benchmark-bar"
              initial={false}
              whileInView={{ scaleX: reduced ? scale : [0, scale] }}
              viewport={{ once: true, amount: 1 }}
              style={{ scaleX: scale, transformOrigin: "left" }}
              transition={{
                duration: reduced ? 0 : 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
          <strong>{value} ms</strong>
        </div>
      ))}
      <p>{project.note}</p>
    </figure>
  );
}
const stages = [
  {
    name: "Discover",
    detail:
      "Find new MapPLUTO releases, download official ZIPs, and verify their integrity.",
    label: "Official releases",
    output: "Verified ZIP",
  },
  {
    name: "Validate",
    detail:
      "Check the dataset schema and geospatial geometries before database ingestion.",
    label: "Schema + geometry",
    output: "Validated staging",
  },
  {
    name: "Merge",
    detail:
      "Merge staging into silver transactionally. Advisory locks prevent overlapping imports; failed runs can roll back and recover.",
    label: "PostgreSQL / PostGIS",
    output: "Idempotent silver",
  },
];
function HousingPipeline({ project }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  return (
    <div
      className="pipeline-visual"
      aria-label="Implemented MapPLUTO ingestion pipeline"
    >
      <div className="data-plate-heading">
        <span>MapPLUTO → PostgreSQL / PostGIS</span>
        <span className="pipeline-symbol" aria-hidden="true">
          ↳
        </span>
      </div>
      <div className="record-count">
        {project.metrics[0][0]}
        <span className="record-unit">NYC {project.metrics[0][1]}</span>
      </div>
      <div
        className="pipeline-steps"
        role="group"
        aria-label="Explore pipeline stages"
      >
        {stages.map((stage, index) => (
          <button
            key={stage.name}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            aria-controls="pipeline-detail"
          >
            <span className="stage-number">0{index + 1}</span>
            {stage.name}
            <span className="stage-arrow" aria-hidden="true">
              {index < 2 ? "→" : "↳"}
            </span>
          </button>
        ))}
      </div>
      <div
        className="pipeline-detail"
        id="pipeline-detail"
        aria-live="polite"
        aria-atomic="true"
      >
        <m.div
          key={active}
          initial={false}
          animate={{ opacity: reduced ? 1 : [0, 1], y: reduced ? 0 : [5, 0] }}
          transition={{ duration: reduced ? 0 : 0.2 }}
        >
          <p className="stage-label">
            {stages[active].label}
            <span aria-hidden="true"> → </span>
            <span>{stages[active].output}</span>
          </p>
          <p>{stages[active].detail}</p>
        </m.div>
      </div>
      <div className="pipeline-proof">
        <span>
          <strong>{project.metrics[1][0]}</strong> {project.metrics[1][1]}
        </span>
        <span>
          <strong>{project.metrics[2][0]}</strong> {project.metrics[2][1]}
        </span>
      </div>
    </div>
  );
}
export default function Projects() {
  const [watchmate, housing, renter] = projects;
  return (
    <section
      className="projects shell section"
      id="projects"
      aria-labelledby="projects-title"
    >
      <div className="section-heading">
        <h2 id="projects-title">Projects</h2>
        <span className="section-count" aria-hidden="true">
          01 — 03
        </span>
      </div>
      <article
        className="watchmate-project"
        id="watchmate"
        aria-labelledby="watchmate-title"
      >
        <div className="project-heading">
          <span className="project-index" aria-hidden="true">
            01 /
          </span>
          <h3 id="watchmate-title">WatchMate</h3>
          <span className="status live">
            <span className="live-dot" aria-hidden="true" />
            Live application
          </span>
        </div>
        <div className="watchmate-layout">
          <Reveal className="project-intro">
            <p className="project-description">{watchmate.description}</p>
            <ProjectLinks project={watchmate} />
            <div className="audience-metrics">
              {watchmate.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
            </div>
            <CacheBenchmark project={watchmate} />
          </Reveal>
          <Reveal delay={0.08} className="project-preview">
            <ScreenshotViewer />
          </Reveal>
        </div>
        <div className="engineering-notes">
          {watchmate.highlights.map((text, i) => (
            <div key={text}>
              <span className="note-number" aria-hidden="true">
                0{i + 1}
              </span>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <Technologies items={watchmate.technologies} />
      </article>
      <article
        className="housing-project"
        id="housing"
        aria-labelledby="housing-title"
      >
        <Reveal className="housing-copy">
          <div className="project-heading">
            <span className="project-index" aria-hidden="true">
              02 /
            </span>
            <span className="status">In development</span>
          </div>
          <h3 id="housing-title">
            NYC Housing
            <br />
            Intelligence Platform
          </h3>
          <p className="project-description">{housing.description}</p>
          <ProjectLinks project={housing} />
          <ul className="project-highlights">
            {housing.highlights.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
          <p className="project-note">{housing.note}</p>
          <Technologies items={housing.technologies} />
        </Reveal>
        <Reveal className="housing-diagram" delay={0.08}>
          <HousingPipeline project={housing} />
        </Reveal>
      </article>
      <Reveal>
        <article
          className="renter-project"
          id="renter"
          aria-labelledby="renter-title"
        >
          <div className="renter-intro">
            <div className="project-heading">
              <span className="project-index" aria-hidden="true">
                03 /
              </span>
              <span className="status">{renter.status}</span>
            </div>
            <h3 id="renter-title">{renter.name}</h3>
            <p className="project-description">{renter.description}</p>
            <ProjectLinks project={renter} />
            <Technologies items={renter.technologies} />
          </div>
          <div className="renter-details">
            <div className="renter-workflow" aria-label="Case workflow">
              <span>Case & evidence</span>
              <span aria-hidden="true">→</span>
              <span>Assessment</span>
              <span aria-hidden="true">→</span>
              <span>PDF forms</span>
            </div>
            <ul className="project-highlights">
              {renter.highlights.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </article>
      </Reveal>
    </section>
  );
}
