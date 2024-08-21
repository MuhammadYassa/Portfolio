import React from 'react'
import Bubble1 from './Bubble1'
import Bubble2 from './Bubble2'
import Reveal from './Reveal';

export default function Hero(props) {
  const {children} = props;

  return (
    <header>
      <div className ="bg-transparent">
        {children}
        <div className="grid grid-rows-2 grid-cols-1 py-16 lg:grid-cols-2 lg:grid-rows-1 justify-items-center items-center">
          <div className="cursor-default">
            <Reveal>
              <Bubble1></Bubble1>
            </Reveal>
            <Reveal>
              <Bubble2></Bubble2>
            </Reveal>
          </div>
          <div className='w-full cursor-default flex flex-col items-center px-4'>
            <Reveal>
              <h1 className="md:text-md font-normal text-nowrap text-[#ffffff]">
                <strong>Hi</strong>, I'm Muhammad Yassa, a Software Engineer
              </h1>
            </Reveal>
            <Reveal>
              <h1 className="md:text-3xl font-bold text-nowrap text-[#ffffff]">
                Passionate about creating impactful <br></br> code that drives real-world results.
              </h1>
            </Reveal>
            <Reveal>
              <h1 className="md:text-md font-medium text-nowrap text-[#ffffff]">
                Turning complex problems into <br></br> innovative solutions.
              </h1>
            </Reveal>
          </div>
        </div>  
      </div>
    </header>
  )
}
