import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

const TiltAboutMe = () => {
  return (
    <div className="grid place-content-center bg-transparent px-4 py-12 text-[#0d0a20]">
      <TiltCard />
    </div>
  );
};

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard = () => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-[60vh] w-[45vw] min-h-[500px] min-w-[400px] rounded-xl bg-[#5b42f5]"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-white shadow-lg"
      >
          <div style={{
            transform: "translateZ(50px)",
          }} >
            <h1 className = "text-5xl font-['Montserrat'] font-bold my-4">
              ABOUT
            </h1>
            <h1 className = "text-xl font-['Montserrat'] font-medium mx-4" >
              I'm a full-stack developer based in New York with experience in Python, JavaScript, C++, and Java. Recently, I've developed a passion for back-end development, focusing on building scalable, robust solutions. My versatile skills allow me to tackle challenges from both front-end and back-end perspectives.
            </h1>
          </div>
      </div>  
    </motion.div>
  );
};

export default TiltAboutMe;