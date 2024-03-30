import React from 'react'
import './myexpertise.css'

const MyExpertise = () => {
  return (
    <div className='expertise-container'>
        <h1>My Expertise</h1>
        <div className='expertise-wrapper'>
            <div className='expertise-card'>
                <h3>About me</h3>
                <p>
                  Proactive software developer and a business manager with a 
                  proven record in technology strategy, frontend development, 
                  and team management, with years of experience in 
                  profit and non-profit organizations, and recently with a focus on 
                  Edtech solutions and multi-discippnary teams.
                </p>
            </div>
            <div className='expertise-card'>
                <h3>Tech Stack</h3>
                  <div className='tech-stack-container'>
                    <div style={{with: 100}}>
                      <h4>FrontEnd</h4>
                        <p>React JS</p>
                        <p>HTML</p>
                        <p>CSS</p>
                        <p>SASS</p>
                        <p>d3</p>
                        <p>i18n</p>
                    </div>
                    <div style={{with: 100}}>
                      <h4>BackEnd</h4>
                          <p>Node</p>
                          <p>Express</p>
                          <p>AdminJs</p>
                          <p>Strapi V3</p>
                    </div>
                    <div style={{with: 100}}>
                      <h4>Testing</h4>
                        <p>React TL</p>
                        <p>Jest</p>
                        <p>Vitest</p>
                        <p>Cypress</p>
                        <p>Mocha</p>
                        <p>Chai</p>
                    </div>
                    <div style={{with: 100}}>
                      <h4>Other</h4>
                        <p>Firebase</p>
                        <p>Aws</p>
                        <p>Sentry</p>
                        <p>Intercom</p>
                    </div>
                  </div>
            </div>
            <div className='expertise-card'>
                <h3>Current Learning</h3>
                <p>
                  I began my journey in the tech industry within the realm of Frontend development. 
                  Currently, I am in the process of transitioning towards FullStack development.
                </p>
                <h4>Learning in Progress:</h4>
                <ul style={{display: 'flex', gap: 32}}>
                  <li>React Native</li>
                  <li>Node</li>
                  <li>Express</li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default MyExpertise