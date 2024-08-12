import React from 'react'
import './my-skills.css'
import Fetch from '../../assets/images/skills/fetch.svg'
import { Link } from 'react-router-dom'

const MySkills = () => {
  return (
    <div className='my-skills-container'>
      <h1>My Skills</h1>
      <div>
      <Link to='/nba-data-page'>
        <img style={{ backgroundColor: 'white', borderRadius: '100px'}} src={Fetch} alt='fetching' />
       <p>Fetching Data</p></Link>
      </div>
      
    </div>
  )
}

export default MySkills