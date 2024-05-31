import React from 'react'
import './navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ResponsiveNavBar from './responsiveNavBar/responsiveNavBar'
import { useTranslation } from 'react-i18next'
import i18n from '../configs/i18n'

const Navbar = () => {
  const navigate = useNavigate()
const [t] = useTranslation()
 const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (tag) => {
    const section = document.getElementById(tag);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } 
  }
  const handleNavigation = (tag) => {
    navigate('/')
    scrollToSection(tag)
    setIsMenuOpen(false)
  }

  const changeLenguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <>
    <div className='navbar-container-mobile'>
    <div className='navbar-wrapper-mobile'>
    <Link to='/'><h1>My Portfolio</h1></Link>
    <div onClick={() => setIsMenuOpen(true)} className='hamburger-menu'>
      <span></span>
      <span></span>
      <span></span>
    </div>
    </div>
    {isMenuOpen &&
    
        <ResponsiveNavBar 
          setIsMenuOpen={setIsMenuOpen} 
          handleNavigation={handleNavigation}
          changeLenguage={changeLenguage}
        />
     
    }
    </div>
    <div className='nav-container'>
      <div className='logo-wrapper'>
      <Link to='/'><h3 className='name-logo'>{t('navigation.logo')}</h3></Link>
      </div>
      <div className='navigation-wrapper'>
        <Link to='/'>{t('navigation.home')}</Link>
        <h5 onClick={() => handleNavigation('my-expertise')}>{t('navigation.expertise')}</h5>
        <h5 onClick={() => handleNavigation('my-work')}>{t('navigation.work')}</h5>
        <h5 onClick={() => handleNavigation('contact')}>{t('navigation.contact')}</h5>
      </div>
      <div className='change-language'>
        <div onClick={() => changeLenguage('en')}>
          <h5 className='lenguage'>{t('navigation.english')}</h5>
        </div>
        <div onClick={() => changeLenguage('es')}>
          <h5 className='lenguage'>{t('navigation.spanish')}</h5>
        </div>
      </div>
    </div>
    </>
  )
}

export default Navbar