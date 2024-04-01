import React from 'react'
import './projects.css'
import { useLocation } from 'react-router-dom'


const ProjectPage = () => {

  const location = useLocation()
  const { data } = location.state

  console.log('data', data)

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
            {data.images.map((image, idx) => (
              <div key={idx}  className='project-image'>
                <img src={image} alt='no image'/>
              </div>
            ))}
          </div>
        </div>
  )
}

export default ProjectPage