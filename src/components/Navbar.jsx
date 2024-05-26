import React from 'react'
import './navbar.css'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

 

  const scrollToSection = (tag) => {
    const section = document.getElementById(tag);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }  
  }
  const handleNavigation = (tag) => {
    navigate('/')
    scrollToSection(tag)
  }

  return (
    <>
    <div className='navbar-container-mobile'>
    <Link to='/'><h1>My Portfolio</h1></Link>
    <div className='hamburger-menu'>
      <span></span>
      <span></span>
      <span></span>
    </div>
    </div>
    <div className='nav-container'>
      <div className='logo-wrapper'>
        <h3 className='name-logo'>JoseMassaro._</h3>
      </div>
      <div className='navigation-wrapper'>
        <Link to='/'>home</Link>
        <h5 onClick={() => handleNavigation('my-expertise')}>expertise</h5>
        <h5 onClick={() => handleNavigation('my-work')}>work</h5>
        <h5 onClick={() => handleNavigation('/contact')}>contact</h5>
      </div>
    </div>
    </>
  )
}

export default Navbar