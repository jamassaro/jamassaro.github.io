import React from 'react'
import './team-page.css'
import { useLocation } from 'react-router-dom'
import { useGetPlayerByTeamPerYear } from '../../../hooks/useGetPlayerByTeamPerYear'
import { useGetTeamStadisticsPerYear } from '../../../hooks/useGetTeamStadisticsPerYear'

const TeamPage = () => {
  const location = useLocation()
  const { data } = location.state
  const year = '2023'
  const { data: players } = useGetPlayerByTeamPerYear(data.id, year)
  // const { data: stadistics } = useGetTeamStadisticsPerYear(data.id, year)
  console.log('data', data)
  // console.log('stadistics', stadistics)
  // const teamStadistic = []
  
  return (
    <div className='team-page-container'>
      <h1>Season {year}</h1>
    <div className='team-information-wrapper'>
      <div className='stadistics-container'>
      <img src={data.logo} alt={data.name} />
        {/* <div className='stadistics-card-container'>
          <div className='stadistics-card'>
            <p>Games: {teamStadistic['games']}</p>
          </div>
          <div className='stadistics-card'>
            <p>Points: {teamStadistic['points']}</p>
          </div>
          <div className='stadistics-card'>
            <p>Assists: {teamStadistic['assists']}</p>
          </div>
          <div className='stadistics-card'>
            <p>Steals: {teamStadistic['steals']}</p>
          </div>
        </div>
         */}
    </div>
    
    <div className='rooster-container'>
    <h2>Rooster</h2>
    <ol>
    {players?.response.map(({firstname, lastname, leagues: { standard }, id}) => (
      <li key={id}>
        {firstname} {lastname} {standard.pos}
      </li>
    ))}  
    </ol>  
    </div>  
    </div>
 
    </div>
  )
}

export default TeamPage