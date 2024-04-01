import React from 'react'
import './mywork.css'

import { useNavigate } from 'react-router-dom'
import { myWorkData } from '../../data'

const MyWork = () => {
    const navigate = useNavigate()
    const handleNavigate = (info) => {
        navigate(
          `/projects/${info.navigation}`,
          { state: { data: info } }
          )
    }
  
return (
  <div id='my-work' className='mywork-container'>
    <h1>My Work</h1>
      <div className='mywork-wrapper-cards'>
      {myWorkData.map((data, idx) => (
        <div 
          key={idx} 
          className='mywork-card' 
          onClick={() => handleNavigate(data.project)}>
            <img className='mywork-image' style={{backgroundColor: `${data.color}`}} src={data.cover} alt='my work image'/>
            <div className='mywork-card-info'>
              <h2>{data.title}</h2>
            </div>
        </div>
        ))}
      </div>
  </div>
  )
}

export default MyWork