import React from 'react'
import MainSection from '../../components/MainSection/MainSection'
import MyExpertise from '../../components/MyExpertise/MyExpertise'
import MyWork from '../../components/MyWork/MyWork'
import MySkills from '../../components/Myskills/myskills'
import './home.css'

const Home = () => {
  return (
    <>
      <MainSection/>
      <MyExpertise/>
      <MyWork/>
      <MySkills/>
    </>
  )
}

export default Home