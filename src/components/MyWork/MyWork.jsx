import React from 'react'
import './mywork.css'

import { useNavigate } from 'react-router-dom'
import { myWorkData } from '../../data'
import { useTranslation } from 'react-i18next'



const MyWork = () => {
    const [t] = useTranslation()
    const navigate = useNavigate()
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    const handleNavigate = (info) => {
        navigate(
          `/projects/${info.navigation}`,
          { state: { data: info } }
          )
        scrollToTop()
    }
  
return (
  <div id='my-work' className='mywork-container'>
    <h1>{t('my-work.title')}</h1>
    <p>{t('my-work.description')}</p>
      <div className='mywork-wrapper-cards'>
      {myWorkData.map((data, idx) => (
        <div 
          key={idx} 
          className='mywork-card' 
          onClick={() => handleNavigate(data.project)}
        >
            <img 
              className='mywork-image' 
              style={{backgroundColor: `${data.color}`}} 
              src={data.cover} 
              alt='my work image'
            />
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