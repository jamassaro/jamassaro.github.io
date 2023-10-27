import React from 'react'
import './mywork.css'
import testImage from '../../assets/ironMan.webp'

const MyWork = () => {
  return (
    <div className='mywork-container'>
        <h1>My Work</h1>
        <div className='mywork-wrapper-cards'>
            <div className='mywork-card'>
                <img className='mywork-image' src={testImage} alt='my work image'/>
                <div className='mywork-card-info'>
                    <h2>proyecto 1</h2>
                    <p>Web Development</p>
                </div>
            </div>
            <div className='mywork-card'>
                <img className='mywork-image' src={testImage} alt='my work image'/>
                <div className='mywork-card-info'>
                    <h2>proyecto 1</h2>
                    <p>Web Development</p>
                </div>
            </div>
            <div className='mywork-card'>
                <img className='mywork-image' src={testImage} alt='my work image'/>
                <div className='mywork-card-info'>
                    <h2>proyecto 1</h2>
                    <p>Web Development</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MyWork