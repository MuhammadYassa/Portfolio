import { cubicBezier, motion, useAnimation } from 'framer-motion'
import React, { useEffect } from 'react'

export default function PreLoader() {
  const easing = cubicBezier(.6,-0.05,.31,1.04);
  const controls = useAnimation();


  useEffect(()=>{
    controls.start({translateY: 1000})
  }) 

  return (
    <motion.div animate={controls} initial= {{translateY: 0}} transition={{ease: easing, duration: 1.5, delay: 2.6 }} className='h-[100vh] w-[100%] animateBorder fixed z-50 top-0 left-0 flex justify-center items-center bg-[#5b42f5]'>
      <div className="inline-block opacity-0 sm:opacity-100">
        <p className="font-['Playfair-Display'] text-white font-[900] text-3xl border-white border-r-4 w-[100%] whitespace-nowrap overflow-hidden typewriter">Loading creativity into code...</p>
      </div>
    </motion.div>
  ) 
}
