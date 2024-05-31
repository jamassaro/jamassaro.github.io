import React from 'react'
import Resume from '../../assets/PDF/resume.pdf'
import './footer.css'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const [t] = useTranslation()
  return (
    <div id='contact' className='footer-container'>
      <div id='contact'>
        <h4>{t('footer.contact')}</h4>
        <p>jamassaro@gmail.com</p>
        <p>+1 (718) 300-3187</p>
      </div>
      <div className='social-wrapper'>
        <a href='https://www.linkedin.com/in/jose-antonio-massaro-mayorga-716a2736/' target='_blank'>
          <p>LinkedIn</p>
        </a>
        <a href='https://github.com/jamassaro' target='_blank'>
          <p>GitHub</p>
        </a>
        <a href={Resume} target='_blank'>
          <p>{t('footer.resume')}</p>
        </a>
      </div>
    </div>
  )
}

export default Footer