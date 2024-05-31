import React from 'react'
import './responseNavBar.css'
import { useTranslation } from 'react-i18next'

const ResponsiveNavBar = ({ setIsMenuOpen, handleNavigation, changeLenguage }) => {
  const [t] = useTranslation()

  const handleChangeLanguage = (lang) => {
    changeLenguage(lang)
    setIsMenuOpen(false)
  }
  return (
    <div className='responsive-info-navbar-container'>
      <div className='responsive-info-navbar-close'>
        <div onClick={() => setIsMenuOpen(false)}>X</div>
      </div>
      <div className='responsive-info-links'>
        <h5 onClick={() => handleNavigation('my-expertise')}>{t('navigation.expertise')}</h5>
        <h5 onClick={() => handleNavigation('my-work')}>{t('navigation.work')}</h5>
        <h5 onClick={() => handleNavigation('contact')}>{t('navigation.contact')}</h5>
      </div>
      <div className='change-language-mobile'>
      <div onClick={() => handleChangeLanguage('en')}>
        <h5 className='lenguage'>{t('navigation.english')}</h5>
      </div>
      <div onClick={() => handleChangeLanguage('es')}>
        <h5 className='lenguage'>{t('navigation.spanish')}</h5>
      </div>
      </div>
    </div>

  )
}

export default ResponsiveNavBar

