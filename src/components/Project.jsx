import React, { useRef } from 'react'
import { motion, useAnimation } from 'framer-motion';

export default function (props) {

  const {children, title, href, desc, image} = props;
  const ref = useRef(null);
  const controls = useAnimation();

  const handleHoverStart = () => {
    controls.start({ translateY: 0 });
  };

  const handleHoverEnd = () => {
    controls.start({ translateY: 200 });
  };
  
  return (
    <motion.div
    className='relative cursor-default'
    onHoverStart={handleHoverStart}
    onHoverEnd={handleHoverEnd}
    onClick={handleHoverStart}
    >
      <h1 
      className="absolute translate-x-[-50%] translate-y-[-50%] top-[100%] left-[50%] z-50 px-4 py-2 bg-[#5b42f5] rounded-3xl text-nowrap"> 
        {children}
      </h1>  
      <div className='relative z-40 overflow-hidden cursor-default text-white font-medium'>
        <motion.div 
        ref={ref} 
        animate = {controls}
        initial={{ translateY:200 }}
        transition={{ease: "circInOut", duration: 0.1 }}
        className="absolute flex flex-col gap-2 h-[200px] z-30 w-[360px] rounded-md bg-[#5b42f5] pt-12 px-6 text-sm">
            <div className = "font-extrabold text-2xl mx-auto ">
              {title}
            </div>
            <div>
              {desc}
            </div>
            <a href={href}>
              <button className= "bg-transparent border font-bold text-base px-3 py-1 rounded-2xl mx-auto hover:bg-white hover:text-[#5b42f5]">
                Website
              </button>
            </a>
        </motion.div>
        <img 
          src={image}
          className="h-[200px] w-[360px] border-4 border-[#5b42f5] rounded-md"
        />
      </div>
    </motion.div>
  )
}