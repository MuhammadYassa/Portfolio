import { useRef } from "react";
import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

// Depth belongs to the project composition; its text and controls stay in normal flow.
export default function DepthPanel({ children, className = "" }) {
  const reduce = useReducedMotion();
  const bounds = useRef(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 120, damping: 24 });
  const rotateY = useSpring(pointerX, { stiffness: 120, damping: 24 });

  function reset() {
    pointerX.set(0);
    pointerY.set(0);
  }
  function enter(event) {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    bounds.current = {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  }
  function move(event) {
    if (reduce || event.pointerType !== "mouse" || !bounds.current) return;
    const rect = bounds.current;
    const x = Math.max(
      -0.5,
      Math.min(0.5, (event.pageX - rect.left) / rect.width - 0.5),
    );
    const y = Math.max(
      -0.5,
      Math.min(0.5, (event.pageY - rect.top) / rect.height - 0.5),
    );
    pointerX.set(x * 5);
    pointerY.set(-y * 5);
  }
  return (
    <m.div
      className={`depth-panel ${className}`}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={reset}
      onFocusCapture={reset}
      style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY }}
    >
      {children}
    </m.div>
  );
}
