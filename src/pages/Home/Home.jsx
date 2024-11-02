import React from 'react'
import MainSection from '../../components/MainSection/MainSection'
import MyExpertise from '../../components/MyExpertise/MyExpertise'
import MyWork from '../../components/MyWork/MyWork'
import './home.css'
import Projects from '../../components/projects/projects'

const Home = () => {
  return (
    <>
      <MainSection/>
      <MyExpertise/>
      <Projects />
      <MyWork/>
    </>
  )
}

export default Home