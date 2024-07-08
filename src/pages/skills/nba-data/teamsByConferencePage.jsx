import React from 'react'
import './teams-by-conference.css'
import { useGetNbaTeamsByConference } from '../../../hooks/useGetNbaTeamsByConference'
import TeamCardComponent from '../../../components/skills/components/teamCardComponent'
import { Bars } from 'react-loader-spinner'
import {  useNavigate, useParams } from 'react-router-dom'

const TeamsByConferencePage = () => {
  const { conferenceName } = useParams()
  const { data, isLoading } = useGetNbaTeamsByConference(conferenceName)
  const navigate = useNavigate()
  
 if (!data || isLoading) {
   return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 800, marginTop:150}}>
     <Bars
        height="80"
        width="80"
        color="#84D6EA"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />  
    </div>
   
   )
 }
  const cleanedTeams = data.filter((team) => team.name !== 'Home Team Stephen A')

  const conferenceNameTitle = conferenceName === 'East' ? 'Eastern Conference' : 'Western Conference' 
 
  const handleNavigate = (team) => {
    const { id } = team
    navigate(`/nba-data-page/conference/${conferenceName}/team/${id}`, { state: { data: team } })
  }

  return (
    <div className='conference-page-container'>
      <h1>{conferenceNameTitle}</h1>
        <div className='conference-wrapper'>
         {cleanedTeams?.map((team) => (
            <TeamCardComponent 
             key={team.id}
             id={team.id}
             team={team}
             handleNavigate={handleNavigate} 
             logo={team.logo} 
             name={team.name} 
             />
          ))}
       </div>
    </div>
  )
}

export default TeamsByConferencePage