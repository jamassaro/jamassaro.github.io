import React from 'react'
import './navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ResponsiveNavBar from './responsiveNavBar/responsiveNavBar'

const Navbar = () => {
  const navigate = useNavigate()

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
        />
     
    }
    </div>
    <div className='nav-container'>
      <div className='logo-wrapper'>
      <Link to='/'><h3 className='name-logo'>My Portfolio</h3></Link>
      </div>
      <div className='navigation-wrapper'>
        <Link to='/'>home</Link>
        <h5 onClick={() => handleNavigation('my-expertise')}>expertise</h5>
        <h5 onClick={() => handleNavigation('my-work')}>work</h5>
        <h5 onClick={() => handleNavigation('contact')}>contact</h5>
      </div>
    </div>
    </>
  )
}

export default Navbar