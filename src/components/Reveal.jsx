import { useEffect } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useAnimate } from "framer-motion/mini";
// Server content stays visible. Animation progressively enhances each block once.
export default function Reveal({ children, className = "", delay = 0 }) {
  const [scope, animate] = useAnimate();
  const visible = useInView(scope, { once: true, amount: 0.12 });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      scope.current.style.removeProperty("opacity");
      scope.current.style.removeProperty("transform");
      return;
    }
    if (!visible) return;
    const animation = animate(
      scope.current,
      { opacity: [0, 1], transform: ["translateY(18px)", "translateY(0px)"] },
      { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
    );
    return () => animation.stop();
  }, [animate, delay, reduced, scope, visible]);
  return (
    <div className={className} ref={scope}>
      {children}
    </div>
  );
}
