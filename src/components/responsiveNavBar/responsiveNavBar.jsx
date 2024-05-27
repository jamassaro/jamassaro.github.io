import React from 'react'
import './responseNavBar.css'

const ResponsiveNavBar = ({ setIsMenuOpen, handleNavigation }) => {
  return (
    <div className='responsive-info-navbar-container'>
      <div className='responsive-info-navbar-close'>
        <div onClick={() => setIsMenuOpen(false)}>X</div>
      </div>
      <div className='responsive-info-links'>
        <h5 onClick={() => handleNavigation('my-expertise')}>Expertise</h5>
        <h5 onClick={() => handleNavigation('my-work')}>Work</h5>
        <h5 onClick={() => handleNavigation('/contact')}>Contact</h5>
      </div>
    </div>

  )
}

export default ResponsiveNavBar