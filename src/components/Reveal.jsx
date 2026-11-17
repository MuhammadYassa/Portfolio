import { m, useReducedMotion } from "framer-motion";
// Content remains visible in prerendered HTML and if IntersectionObserver never fires.
export default function Reveal({ children, delay = 0, className }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={false}
      whileInView={reduce ? undefined : { opacity: [0.65, 1], y: [14, 0] }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
