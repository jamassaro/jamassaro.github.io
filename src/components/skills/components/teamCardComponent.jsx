import React from 'react'
import './team-card-component.css'

const TeamCardComponent = ({ handleNavigate, team }) => {

  const { logo, name } = team

  return (
      <div onClick={() => handleNavigate(team)} className='team-card'>
        <div className='team-image'>
          <img src={logo} alt={name} />
        </div>
        <div className='team-name'>
          <h2>{name}</h2>
        </div>
      </div>
   
  )
}

export default TeamCardComponent