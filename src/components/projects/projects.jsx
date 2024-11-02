import React from 'react'
import './projects.css'
import ProjectCard from './project-card'

const Projects = () => {
  return (
    <div id='projects' className='projects-container'>
      <h1>Projects</h1>
      <div className='projects-wrapper'>
        <ProjectCard projectName='AVTR SMART AI' technologies={['React', 'Java', 'Azure']} />
        <ProjectCard projectName='Tracking expenses' technologies={['Next.js', 'React Native', 'Tailwind']} />
        <ProjectCard projectName='Accurate' technologies={['React', 'Tailwind', 'Express']} />
      </div>
    </div>
  )
}

export default Projects