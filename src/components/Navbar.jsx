import React from 'react'
import './navbar.css'

const Navbar = () => {
  return (
    <div className='nav-container'>
      <div className='logo-wrapper'>
        <h3 className='name-logo'>JoseMassaro._</h3>
      </div>
      <div className='navigation-wrapper'>
        <h5>home</h5>
        <h5>expertise</h5>
        <h5>work</h5>
        <h5>contact</h5>
      </div>
    </div>
  )
}

export default Navbar