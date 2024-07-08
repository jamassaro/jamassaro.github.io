import React from 'react'
import './nba-data-page.css'
import { useNavigate } from 'react-router-dom'
import East from '../../../assets/images/conferences-logos/Eastern_Conference.png'
import West from '../../../assets/images/conferences-logos/Western_Conference.png'

const NbaDataPage = () => {

  const navigate = useNavigate()

  const handlenavigation = (conference) => {
    navigate(`conference/${conference}`)
  }

  return (
    <div className='nba-page-container'>
       <h1>Fetching Data</h1>
       <p>
        This page utilizes NBA data from the RapidAPI API as a 
        practice exercise for fetching data. 
        The NBA is categorized by conferences, 
        with each conference further divided into teams. 
        Clicking on any team will reveal data from past seasons. 
        The main objective of this exercise is to employ 
        fetching techniques using fetch(), TanStack (React Query), 
        and passing data through the router.
        </p>
       <div className='nba-team-container'>
          <div className='nba-team-wrapper'>
            <div onClick={() => handlenavigation('East')}>
              <img src={East} alt='East' />
            </div>
            <div onClick={() => handlenavigation('West')}>
              <img src={West} alt='West' />
            </div>
          </div>
       </div>
    </div>
  )
}

export default NbaDataPage