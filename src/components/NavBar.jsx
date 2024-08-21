import React from 'react' 
import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HashLink as Link } from 'react-router-hash-link'
import Header from './Header'
import AboutMe from './AboutMe'
import Contact from './Contact'
import { AnimatePresence, motion, spring, delay} from 'framer-motion'

export default function NavBar() {
  const navLinks = [
    {title: "About Me", href: "#aboutme"},
    {title: "Projects", href: "#projects"},
    {title: "Contact Me", href: "#contact"},
  ];

  const [open,setOpen] = useState(false);
  const toggleMenu = () => {
    setOpen(!open)
  };
  const menuVars = {
      initial : {
        scaleY: 0, 
      },
      animate : {
        scaleY: 1,
        type: "spring",
        transiton : {
          duration: 0.5,
          ease : [0.12, 0, 0.39, 0],
        }
      },
      exit : {
        scaleY: 0,
        type: "spring",
        transition : {
          duration: 0.5,
          ease : [0.22, 1, 0.36, 1],
        }
      }
    };

  const containerVars = {
    initial : {
      transition : {
        staggerChildren: 0.09,
        staggerDirection: -1,
      }
    },
    open : {
      transition : {
        delayChildren: 0.3,
        staggerChildren: 0.09,
        staggerDirection: 1,
      }
    }
  }

  return (
    <div className = "bg-transparent backdrop-blur-sm sticky top-0 z-[100] flex justify-between flex-row items-center text-[#ffffff] text-sm h-[10vh] border-b border-white pr-9">
      <nav>
        <Link to ="#home" smooth>
          <img src='/Logo3.png' alt='Logo' className="min-w-64 w-64 pl-9 hidden sm:flex" />
          <img src='/Logo4.png' alt='Logo' className = "min-w-14 w-14 sm:hidden"/>
        </Link>
      </nav>
      <div className = "flex-row justify-center items-center hidden sm:flex">
       <Link to = "#aboutme" smooth>
          <button className = "navItems">
            ABOUT
          </button>
        </Link>
        <Link to = "#projects" smooth>
          <button className = "navItems">
              PROJECTS
          </button>
        </Link>
        <Link to = "#contact" smooth>
          <button className = "navItems">
              CONTACT ME
          </button>
        </Link>
      </div>
      <nav className= "sm:hidden">
        <button onClick={toggleMenu}>
        <i className="fa-solid fa-bars text-xl bg-[#5b42f5] hover:bg-[#ffffff] hover:text-[#0d0a20] px-3 py-1 rounded-3xl transition-all ease-in-out"></i>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div 
            variants={menuVars}
            initial = "initial"
            animate = "animate" 
            exit = "exit"
            className='origin-top fixed z-[3000] left-0 top-0 w-full h-screen bg-[#5b42f5] text-[#0d0a20] p-10'>
            <div className='flex h-full flex-col'>
              <div className='flex justify-between'>
                <img src='/Logo4.png' alt='Logo' className = "min-w-14 w-14"/>
                <button onClick={toggleMenu}>
                  <i className="fa-solid fa-x text-xl bg-[#5b42f5] hover:bg-[#ffffff] hover:text-[#0d0a20] text-white px-3 py-1 rounded-3xl transition-all ease-in-out"></i>
                </button>
              </div>
              <motion.div variants={containerVars} initial= "initial" animate= "open" exit="initial" className='flex flex-col h-full justify-center font-bold font-["Montserrat"] items-center gap-9'>
                {navLinks.map((link,index) => {
                    return (
                    <div className='overflow-hidden'>
                      <MobileNavLink handleOpen = {toggleMenu} key = {index} title = {link.title} href = {link.href} /> 
                    </div>
                    );
                  })}
              </motion.div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  )
}

const mobileLinkVars = {
  initial : {
    y: "30vh",
    transition : {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1],
    }
  },
  open : {
    y: 0,
    transition : {
      duration : 0.7,
      ease: [0, 0.55, 0.45, 1]
    }
  }
}

const MobileNavLink = ({title, href, handleOpen}) => {
  return (
    <motion.div variants={mobileLinkVars}>
      <Link onClick={handleOpen} className='text-5xl uppercase text-white hover:text-[#0d0a20] transition-all ease-in-out' to={href} smooth>
        {title}
      </Link>
    </motion.div>
  )
}