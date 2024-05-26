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
            <h3>Description</h3>
            <p>{data.description}</p>
            <p style={{textAlign: 'center', marginTop: '10px'}}>{data.url}</p>
          </div>
          <div className='description-container'>
            <h3>Stack Used</h3>
            <ul className='description-list'>
            {data.stack.map((stack) => (
              <li key={stack}>{stack}</li>
            ))}
            </ul>
          </div>
          </div>
          {<div className='project-image-container'>
            {data.images.map((image, idx) => (
              <div key={idx}  className='project-image'>
                <img src={image} alt='no image'/>
              </div>
            ))}
          </div>}
        </div>
  )
}

export default ProjectPage