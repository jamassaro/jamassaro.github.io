import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer/Footer'

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