import React from 'react'
import './main-section.css'
import Resume from '../../assets/PDF/resume.pdf'
import { useTranslation } from 'react-i18next'

const MainSection = () => {
  const [t] = useTranslation()
  return (
    <div className='main-section-container'>
      <h1>JOSE A MASSARO.</h1>
      <p className='role-information'>{t('main-section.role')}</p>
      <p className='main-section-description'>
        {t('main-section.description')}
      </p>
      <div className='social-information'>
        <a href='https://www.linkedin.com/in/jose-antonio-massaro-mayorga-716a2736/' target='_blank' rel="noreferrer"> <p>LinkedIn</p></a>
        <a href='https://github.com/jamassaro' target='_blank' rel="noreferrer"> <p>GitHub</p></a>
        <a href={Resume} target='_blank' rel="noreferrer"> <p>{t('main-section.resume')}</p></a>
        </div>
    </div>
  )
}

export default MainSection