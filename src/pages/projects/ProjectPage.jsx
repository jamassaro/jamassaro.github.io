import React from 'react'
import './projects.css'
import { useLocation } from 'react-router-dom'


const ProjectPage = () => {

  const location = useLocation()
  const { data } = location.state

  return (
        <div className='project-page-container'>
          <div className='project-title'>
            <h2>{data.name}</h2>
          </div>
          <div className='project-information-container'>
          <div className='description-container'>
            <h3>Description:</h3>
            <p>{data.description}</p>
          </div>
          <div className='description-container'>
            <h3>Stack Used</h3>
            <p>{data.stack}</p>
          </div>
          </div>
          <div className='project-image-container'>
            <div className='project-image'>
              <h3>Photos</h3>
            </div>
            <div className='project-image'>
              <h3>Photos</h3>
            </div>
            <div className='project-image'>
              <h3>Photos</h3>
            </div>
            <div className='project-image'>
              <h3>Photos</h3>
            </div>
          </div>
        </div>
  )
}

export default ProjectPage