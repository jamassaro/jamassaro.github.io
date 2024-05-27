import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer/Footer'
import './layout.css'

const LayOut = ({ children }) => {
  return (
    <div className='layout-container'>
      <Navbar/>
      <div className='main-container'>
        { children }
      </div>
      <Footer/>
    </div>
  )
}

export default LayOut