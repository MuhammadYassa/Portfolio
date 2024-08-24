import React from 'react'
import TiltAboutMe from './TiltAboutMe'
import TiltSkills from './TiltSkills'

export default function AboutMe() {
  return (
    <div id= "aboutme" className="spacer layerAbout h-fit">
      <div className= "grid grid-cols-1 lg:grid-cols-2" >
        <TiltAboutMe></TiltAboutMe>
        <TiltSkills></TiltSkills>
      </div>
    </div>
  )
}
