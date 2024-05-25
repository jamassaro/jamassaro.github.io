import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer/Footer'

const LayOut = ({ children }) => {
  return (
    <div>
      <Navbar/>
      <div>
        { children }
      </div>
      <Footer/>
    </div>
  )
}

export default LayOut