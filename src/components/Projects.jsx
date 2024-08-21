import { motion } from 'framer-motion'
import React from 'react'
import Project from './Project'

export default function Projects() {
  const projects = [
    {
      ProjectName: "Weather App",
      ProjectDescription: "Developed Java weather app with real-time data." ,
      ProjectHref: "https://github.com/MuhammadYassa/Projects/tree/main/WeatherApp" ,
      ProjectImage: "/WeatherApp.png",
    },
    {
      ProjectName: "Tile Matching Game" ,
      ProjectDescription: "Built tile-matching game with efficient algorithms and dynamic colors." ,
      ProjectHref: "https://github.com/MuhammadYassa/Projects/tree/main/TileMatchingGame" ,
      ProjectImage: "/TileMatchingGame.jpeg" ,
    },
    {
      ProjectName: "Calculator App" ,
      ProjectDescription: "Designed robust Java calculator with intuitive interface." ,
      ProjectHref: "https://github.com/MuhammadYassa/Projects/tree/main/CalculatorApp",
      ProjectImage: "/CalculatorApp.jpg" , 
    },
    {
      ProjectName: "Pangram Maker",
      ProjectDescription: "Created Java pangram generator with integrated help.",
      ProjectHref: "https://github.com/MuhammadYassa/Projects/tree/main/PangramMaker",
      ProjectImage: "/PangramMaker.jpg" , 
    },
    {
      ProjectName: "8-Queens Problem",
      ProjectDescription: "Solved 8 Queens in C++ with optimized backtracking.",
      ProjectHref: "https://github.com/MuhammadYassa/Projects/tree/main/8QueensProblemWithFancyPrint",
      ProjectImage: "/8QueensProblem.png" , 
    },
  ]

  const fadeInAnimationsVariants = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.15*index,
      },
    }),
  }
  return (
    <div  id = "projects" className = "h-fit mb-52">
      <h1 className = "my-10 text-5xl font-['Montserrat'] font-semibold cursor-default">
        PROJECTS  
      </h1>
      <div className ="grid grid-cols-1 grid-rows-6 md:grid-cols-2 md:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 mx-12 my-12 gap-7 justify-items-center items-center">
        {projects.map((project,index) => {
          return (
            <motion.div variants={fadeInAnimationsVariants} initial = "initial" whileInView="animate" viewport={{ once: false, amount: 0.5}} custom = {1}>
              <Project title = {project.ProjectName} desc = {project.ProjectDescription} href = {project.ProjectHref} image = {project.ProjectImage}> Project {index+1} </Project>
            </motion.div>
          );
        })}
      </div>
    </div>
  )
}
