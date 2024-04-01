import React from 'react'
import './navbar.css'
import { Link, Navigate, useNavigate } from 'react-router-dom'

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
    <div className='nav-container'>
      <div className='logo-wrapper'>
        <h3 className='name-logo'>JoseMassaro._</h3>
      </div>
      <div className='navigation-wrapper'>
        <Link to='/'>home</Link>
       <h5 onClick={() =>handleNavigation('my-expertise')}>expertise</h5>
       <h5 onClick={() =>handleNavigation('my-work')}>work</h5>
       <h5 onClick={() =>handleNavigation('/contact')}>contact</h5>
      </div>
    </div>
  )
}

export default Navbar