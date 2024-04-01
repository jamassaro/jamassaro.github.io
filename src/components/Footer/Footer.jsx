import React from 'react'
import './footer.css'

const Footer = () => {
  return (
    <div className='footer-container'>
        <div id='contact'>
            <h4>Contact Information:</h4>
            <p>jamassaro@gmail.com</p>
            <p>+1 (718) 300-3187</p>
        </div>
        <div className='social-wrapper'>
        <a href='https://www.linkedin.com/in/jose-antonio-massaro-mayorga-716a2736/' target='_blank'> <p>LinkedIn</p></a>
        <a href='https://github.com/jamassaro' target='_blank'> <p>GitHub</p></a>
        <a href='https://github.com/jamassaro' target='_blank'> <p>Resume</p></a>
        </div>
    </div>
  )
}

export default Footer