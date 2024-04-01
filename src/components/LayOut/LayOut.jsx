import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer/Footer'

const LayOut = ({ children }) => {
  return (
    <div>
      <Navbar/>
      <div style={{marginLeft: 100, marginRight: 100}}>
        { children }
      </div>
      <Footer/>
    </div>
  )
}

export default LayOut