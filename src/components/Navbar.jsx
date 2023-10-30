import React from 'react'
import './navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='nav-container'>
      <div className='logo-wrapper'>
        <h3 className='name-logo'>JoseMassaro._</h3>
      </div>
      <div className='navigation-wrapper'>
        <Link to='/'><h5>home</h5></Link>
        <h5>expertise</h5>
        <h5>work</h5>
        <h5>contact</h5>
      </div>
    </div>
  )
}

export default Navbar