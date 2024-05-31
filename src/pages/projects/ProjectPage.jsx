import React from 'react'
import './projects.css'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


const ProjectPage = () => {
  const [t] = useTranslation()
  const location = useLocation()
  const { data } = location.state

  console.log(location)

  return (
        <div className='project-page-container'>
          <div className='project-title'>
            <h2>{data.name}</h2>
          </div>
          <div className='project-information-container'>
          <div className='description-container'>
            <h3>{t('my-work.my-work-page.description')}</h3>
              <p className='description-text'>{t(data.description)}</p>
              <p style={{textAlign: 'center', marginTop: '10px'}}>{data.url}</p>
          </div>
          <div className='description-container'>
            <h3>{t('my-work.my-work-page.stack')}</h3>
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