import React from 'react'
import './projects.css'
import ProjectCard from './project-card'
import { projects } from '../../data'




const Projects = () => {
  return (
    <div id='projects' className='projects-container'>
      <h1>Projects</h1>
      <div className='projects-wrapper'>
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  )
}

export default Projects