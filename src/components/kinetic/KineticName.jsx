import { useEffect, useRef, useSyncExternalStore } from "react";
import { createKineticPhysics } from "./kineticPhysics";
import "./kinetic-name.css";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(listener) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const serverMotion = () => false;

export default function KineticName({ name }) {
  const stage = useRef(null);
  const physics = useRef(null);
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, serverMotion);
  const words = name.split(" ");
  useEffect(() => {
    const system = createKineticPhysics(stage.current, reduced);
    physics.current = system;
    return () => { system.destroy(); physics.current = null; };
  }, [reduced]);

  return (
    <div className="kinetic-name">
      <h1 id="intro-title" className="kinetic-stage" ref={stage}>
        <span className="kinetic-accessible">{name}</span>
        <span className="kinetic-art" aria-hidden="true">
          {words.map((word, row) => (
            <span className="kinetic-word" key={`${word}-${row}`}>
              {[...word, ...(row === words.length - 1 ? ["."] : [])].map((letter, index) => (
                <span className="kinetic-slot" data-letter={letter} data-row={row} key={index}>
                  <span className="kinetic-letter">{letter}</span>
                </span>
              ))}
            </span>
          ))}
        </span>
      </h1>
      <div className="kinetic-invitation">
        <button type="button" className="kinetic-pluck" onClick={() => physics.current?.pluck()}
          aria-label={reduced ? "Change name ink color" : "Play name animation"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" stroke="currentColor" strokeWidth="1.7" />
          </svg>
          {reduced ? "A little change of ink" : "Give it a pluck"}
        </button>
        {!reduced && <span className="kinetic-drag-hint" aria-hidden="true">or drag a letter</span>}
      </div>
    </div>
  );
}
