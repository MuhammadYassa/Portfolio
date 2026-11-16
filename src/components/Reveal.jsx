import { m, useReducedMotion } from "framer-motion";
// Content remains visible in prerendered HTML and if IntersectionObserver never fires.
export default function Reveal({ children }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={false}
      whileInView={reduce ? undefined : { y: [12, 0] }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
