import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { projects, experience } from "../../data/portfolio";
import CityScene from "./CityScene";
import "./city.css";
import "./city-frame.css";

const locations = [
  { id: "watchmate", name: "WatchMate", place: "The cinema", kind: "Full-stack application", color: "#f5c89b" },
  { id: "housing", name: "NYC Housing Intelligence", place: "The residential block", kind: "Autonomous data pipeline", color: "#c4adf3" },
  { id: "renter", name: "Renter Dispute Assistant", place: "The civic hall", kind: "Academic team project", color: "#d1c8eb" },
  { id: "dnr", name: "DNR Events", place: "The recording studio", kind: "Software engineering internship", color: "#a8c4eb" },
];

export default function MiniatureCity() {
  const [selected, setSelected] = useState(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const reduced = useReducedMotion();
  const location = locations.find((item) => item.id === selected);
  const project = projects.find((item) => item.id === selected);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.08 });
    observer.observe(root.current);
    const visibility = () => root.current?.classList.toggle("city-page-hidden", document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  const select = (id, element) => {
    trigger.current = element;
    setSelected(id);
  };
  const close = () => {
    setSelected(null);
    trigger.current?.focus({ preventScroll: true });
  };
  const move = (event) => {
    if (reduced || paused || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    root.current.style.setProperty("--city-x", `${((event.clientX-bounds.left)/bounds.width-.5)*7}px`);
    root.current.style.setProperty("--city-y", `${((event.clientY-bounds.top)/bounds.height-.5)*4}px`);
  };
  const reset = () => {
    root.current.style.setProperty("--city-x", "0px");
    root.current.style.setProperty("--city-y", "0px");
  };

  return <section ref={root} className={`miniature-city shell ${visible ? "city-visible" : ""} ${paused ? "city-paused" : ""}`} id="city" aria-labelledby="city-title" onKeyDown={(e) => { if(e.key === "Escape" && selected) { e.preventDefault(); close(); } }}>
    <div className="city-heading"><h2 id="city-title">A little New York. <em>A closer look at my work.</em></h2></div>
    <div className="city-window-bar">Choose a building to explore</div>
    <div className="city-world">
      <div className="city-scene" onPointerMove={move} onPointerLeave={reset}>
        <CityScene selected={selected} onSelect={select} />
        <div className="city-scene-footer"><button className="city-motion" aria-pressed={paused} onClick={()=>{setPaused(!paused);reset();}}>{paused ? "Resume motion" : "Pause motion"}</button></div>
      </div>
      <div className="city-locations" role="group" aria-label="Choose a city location">{locations.map((item,index)=><button key={item.id} onClick={(e)=>select(item.id,e.currentTarget)} aria-pressed={selected === item.id} aria-controls="city-detail"><span className="city-location-number" style={{color:item.color}}>0{index+1}</span><span>{item.name}<small>{item.place}</small></span><span className="city-location-indicator" aria-hidden="true">+</span></button>)}</div>
      <div className="city-detail" id="city-detail" role="region" aria-label="City location preview" aria-live="polite" aria-atomic="true">
        {location ? <div className="city-detail-content" key={selected}>
          <div className="city-detail-top"><span>{location.place}</span><button onClick={close} aria-label="Close city preview">×</button></div>
          <p className="city-detail-kind">{location.kind}</p>
          <h3>{location.name}</h3>
          <p className="city-description">{project ? project.description : experience.context}</p>
          {project?.metrics ? <dl className="city-metrics">{project.metrics.slice(0,2).map(([value,label])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : <p className="city-feature">{selected === "dnr" ? "Daily Sudoku, an authenticated puzzle API, and scheduled board generation in C# / .NET." : "Authenticated case workflows, evidence management, and prefilled official New York PDF forms for review."}</p>}
          {selected === "housing" && <p className="city-caveat">Autonomous MapPLUTO ingestion is implemented. The broader platform is in development. These buildings are illustrative.</p>}
          <div className="city-preview-links">{project?.live && <a href={project.live} target="_blank" rel="noopener noreferrer">Visit WatchMate</a>}{project?.github && <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub repository</a>}<a href={`#${selected === "dnr" ? "experience" : selected}`}>Read {selected === "dnr" ? "experience" : "project"} details</a></div>
        </div> : <div className="city-overview"><span className="city-overview-icon" aria-hidden="true">⌘</span><h3>Built in New York.</h3><p>Explore the buildings to discover the projects and experience behind them.</p><div className="city-overview-rule" /><span>Tap a building or choose a location below.</span></div>}
      </div>
    </div>
    <noscript><p className="city-noscript">Explore the <a href="#projects">projects</a> and <a href="#experience">experience</a> below. Enable JavaScript to interact with the neighborhood.</p></noscript>
  </section>;
}
