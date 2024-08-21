import React from 'react'

export default function Footer() {
  return (
    <div className = "h-[30vh] bg-[#0d0a20] grid grid-cols-1 grid-rows-3 lg:grid-cols-3 lg:grid-rows-1 justify-between px-8 items-center">
      <div className="text-sm text-nowrap cursor-default">
        <i className="fa-regular fa-copyright mx-1"></i>
        2024 Muhammad Yassa. All rights reserved.
      </div>
      <div> 
        <img src='/Portfolio/logo4.png' alt='Logo' className= "min-w-24 w-24 inline-block md:hidden"/>
        <img src='/Portfolio/logo3.png' alt='Logo' className= "min-w-72 w-72 hidden md:inline-block"/>
      </div>
      <div className="text-2xl">
        <a href='https://www.instagram.com/muhammed_yassa/'>
        <i className="fa-brands fa-instagram mx-3 hover:text-[#d62976] transition-all"></i>
        </a>
        <a href="https://www.linkedin.com/in/muhammadyassa/">
        <i className="fa-brands fa-linkedin mx-3 hover:text-[#0077B5] transition-all"></i>
        </a>
        <a href='https://github.com/muhammadyassa'>
        <i className="fa-brands fa-github mx-3 hover:text-black transition-all"></i>
        </a>
      </div>
    </div>
  )
}
