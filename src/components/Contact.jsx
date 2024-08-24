import React from 'react'

export default function Contact() {
  return (
    <div  id = "contact" className="spacer layerContact h-[110vh]">
      <div className='cursor-default'>
        <div className= "grid grid-cols-1 sm:grid-cols-2">
          <div className='mx-10'>
            <h1 className="text-2xl font-bold font-['POPPINS']">GET IN TOUCH</h1>
            <form action="https://formsubmit.co/muhammedyassa2004@gmail.com" method="POST">
              <div>
                <input className= "shadow-inner bg-slate-200 border-2 border-[#5a42f500] hover:bg-white focus:bg-white hover:border-[#5a42f5] focus:outline-none focus:border-[#5a42f5] rounded-full w-[100%] p-3 my-5 text-[#0d0a20] transition-all" type='text' placeholder='Your Name' name='name' required></input>
              </div>
              <div>
                <input className= "shadow-inner bg-slate-200 border-2 border-[#5a42f500] hover:bg-white focus:bg-white hover:border-[#5a42f5] focus:outline-none focus:border-[#5a42f5] rounded-full w-[100%] p-3 my-5 text-[#0d0a20] transition-all" type='email' placeholder='Your Email' name='email' required></input>
              </div>
              <div>
                <textarea className = "shadow-inner bg-slate-200 border-2 border-[#5a42f500] hover:bg-white focus:bg-white hover:border-[#5a42f5] focus:outline-none focus:border-[#5a42f5] rounded-full w-[100%] h-[15vh] resize-none p-5 my-5 text-[#0d0a20] transition-all" type='text' placeholder='Your Message' name='text' required></textarea>
              </div>
              <div>
                <button className = "submitButton" type='submit'>Submit</button>
              </div>
            </form>
          </div>
          <div className= "hidden sm:block" >
            <h1 className="my-2 text-2xl font-bold font-['POPPINS']">No Forms? No Problem.</h1>
            <h1 className='text-[#5b42f5]'>
              <i className="fa-solid fa-envelope pr-1 hover:text-white transition-all"></i>
              <a href = "mailto:muhammedyassa2004@gmail.com" className='underline hover:text-white transition-all'>-muhammedyassa2004@gmail.com</a> 
            </h1>
            <h1 className="font-medium">
            You can always send me an email directly.
            </h1>
            <h1 className='my-5'>
              <strong>OR</strong> <br />
              CONTACT ME ON:
            </h1>
            <div className='text-5xl'>
              <a href = "https://www.instagram.com/muhammed_yassa/">
                <i className="fa-brands fa-instagram mx-3 hover:text-[#d62976] transition-all"></i>
              </a>
              <a href = "https://www.linkedin.com/in/muhammadyassa/">          
                <i className="fa-brands fa-linkedin mx-3 hover:text-[#0077B5] transition-all"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
