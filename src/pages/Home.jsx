import React from 'react'
import Navbar from '../components/Navbar'
import MainSection from '../components/MainSection/MainSection'
import MyExpertise from '../components/MyExpertise/MyExpertise'
import MyWork from '../components/MyWork/MyWork'
import Footer from '../components/Footer/Footer'
import './home.css'

const Home = () => {
  return (
    <div className='home-container'>
        <Navbar/>
        <MainSection/>
        <MyExpertise/>
        <MyWork/>
        <Footer/>
    </div>
  )
}

export default Home