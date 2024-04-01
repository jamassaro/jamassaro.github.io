import React from 'react'
import './navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const scrollToSection = (tag) => {
    const section = document.getElementById(tag);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }  
  }

  return (
    <div className='nav-container'>
      <div className='logo-wrapper'>
        <h3 className='name-logo'>JoseMassaro._</h3>
      </div>
      <div className='navigation-wrapper'>
        <Link to='/'>home</Link>
       <h5 onClick={() =>scrollToSection('my-expertise')}>expertise</h5>
       <h5 onClick={() =>scrollToSection('my-work')}>work</h5>
       <h5 onClick={() =>scrollToSection('contact')}>contact</h5>
      </div>
    </div>
  )
}

export default Navbar