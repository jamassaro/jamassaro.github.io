import React from 'react'
import './mywork.css'

import { useNavigate } from 'react-router-dom'
import { myWorkData } from '../../data'
import { useTranslation } from 'react-i18next'
import ProjectCard from '../projects/project-card'



const MyWork = () => {
    const [t] = useTranslation()
    const navigate = useNavigate()
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const handleNavigate = (info) => {
        navigate(
          `/projects/${info.navigation}`,
          { state: { data: info } }
          )
        scrollToTop()
    }
  
return (
  <div id='my-work' className='mywork-container'>
    <h1>{t('my-work.title')}</h1>
    <p className='mywork-description'>{t('my-work.description')}</p>
      <div className='mywork-wrapper-cards'>
        {
          myWorkData.map((data, idx) => (
            <div key={idx} onClick={() => handleNavigate(data.project)}>
              <ProjectCard projectName={data.title} technologies={data.project.stack} key={idx} description={t(data.project.description)} />
            </div>
          ))
        }
      </div>
  </div>
  )
}

export default MyWork