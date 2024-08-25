import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

const TiltSkills = () => {
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
      className="relative h-[60vh] w-[45vw] min-h-[375px] min-w-[285px] rounded-xl bg-[#5b42f5]"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-white shadow-lg"
      >
        <div
          style={{
            transform: "translateZ(50px)",
          }}
        >
          <h1 className="text-4xl md:text-5xl font-['Montserrat'] font-bold my-4">
            SKILLS
          </h1>
          <div className="text-3xl md:text-5xl grid grid-cols-3 gap-9">
            <i className="fa-brands fa-js transition-all hover:scale-125 hover:text-[#f7df1e]"></i>
            <i className="fa-brands fa-java transition-all hover:scale-125 hover:text-[#5382a1]"></i>
            <i className="fa-brands fa-python transition-all hover:scale-125 hover:text-[#ffde57]"></i>
            <i className="fa-brands fa-css3-alt transition-all hover:scale-125 hover:text-[#264de4]"></i>
            <i className="fa-brands fa-html5 transition-all hover:scale-125 hover:text-[#e34c26]"></i>
            <i className="fa-brands fa-react transition-all hover:scale-125 hover:text-[#61DBFB]"></i>
            <i className="fa-brands fa-git-alt transition-all hover:scale-125 hover:text-[#F1502F]"></i>
            <i className="fa-solid fa-c text-lg md:text-2xl mt-2 transition-all hover:scale-125 hover:text-[#044F88]">
              ++
            </i>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TiltSkills;
