import React, { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView} from "framer-motion";

export default function Reveal(props) {
  const {children} = props;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    mainControls.start("visible");
    slideControls.start("visible");
  }, [isInView]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "fit-content",
        overflow: "hidden",
      }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn", delay:0.15 }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          background: "#0d0a20",
          zIndex: 20,
        }}
      />
    </div>
  );
}
