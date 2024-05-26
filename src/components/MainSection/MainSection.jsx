import React from 'react'
import './main-section.css'
import Resume from '../../assets/PDF/resume.pdf'

const MainSection = () => {
  return (
    <div className='main-section-container'>
      <h1>JOSE A MASSARO.</h1>
      <p className='role-information'>SOFTWARE DEVELOPER</p>
      <p className='main-section-description'>
        Proactive software developer and a business manager with a 
        proven record in technology strategy, frontend development, 
        and team management, with years of experience in 
        profit and non-profit organizations, and recently with a focus on 
        Edtech solutions and multi-discippnary teams.
      </p>
      <div className='social-information'>
        <a href='https://www.linkedin.com/in/jose-antonio-massaro-mayorga-716a2736/' target='_blank'> <p>LinkedIn</p></a>
        <a href='https://github.com/jamassaro' target='_blank'> <p>GitHub</p></a>
        <a href={Resume} target='_blank'> <p>Resume</p></a>
        </div>
    </div>
  )
}

export default MainSection