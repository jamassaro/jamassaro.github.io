import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer/Footer'

const LayOut = ({ children }) => {
  return (
    <div>
      <Navbar/>
      <div style={{ height: 'min-content', marginLeft: 20, marginRight: 20 }}>
        { children }
      </div>
      <Footer/>
    </div>
  )
}

export default LayOut