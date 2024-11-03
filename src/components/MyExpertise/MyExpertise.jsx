import React from 'react'
import './myexpertise.css'
import HTML from '../../assets/logos/frontend/html.svg'
import CSS from '../../assets/logos/frontend/css.svg'
import SASS from '../../assets/logos/frontend/sass.svg'
import NODE from '../../assets/logos/backend/nodejs.svg'
import JavaScript from '../../assets/logos/frontend/javascript.svg'
import Tailwind from '../../assets/logos/frontend/tailwind.svg'
import ReactTl from '../../assets/logos/testing/octopus.png'
import Jest from '../../assets/logos/testing/jest.svg'
import Mocha from '../../assets/logos/testing/mocha.svg'
import Chai from '../../assets/logos/testing/chai.svg'
import Vitest from '../../assets/logos/testing/vitest.svg'
import Cypress from '../../assets/logos/testing/cypress.svg'
import ReactLogo from '../../assets/logos/frontend/react.svg'
import AWS from '../../assets/logos/others/aws.svg'
import Firebase from '../../assets/logos/others/firebase.svg'
import Express from '../../assets/logos/backend/express.svg'
import SENTRY from '../../assets/logos/others/sentry.svg'
import DOCKER from '../../assets/logos/others/docker.svg'
import GITHUB from '../../assets/logos/others/github.svg'
import JIRA from '../../assets/logos/others/jira.svg'
import { useTranslation } from 'react-i18next'

const MyExpertise = () => {

  const expertiseData = [
    {
      title: 'my-expertise.tech-stack-subtitle',
      color: 'blue',
      list: [
        {
        name: 'react',
        src: ReactLogo
      }, 
      {
        name: 'html',
        src: HTML
      },
      {
        name: 'css',
        src: CSS
      },
      {
        name: 'sass',
        src: SASS
      },
      {
        name: 'tailwind',
        src: Tailwind
      },
      {
        name: 'javascript',
        src: JavaScript
      }
    ]
  },
    {
      title: 'my-expertise.tech-stack-subtitle2',
      color: 'green',
      list: [
        {
          name: 'node',
          src: NODE
        },
        {
          name: 'express',
          src: Express
        },
        {
          name: 'javascript',
          src: JavaScript
        }
       ]
    },
    {
      title: 'my-expertise.tech-stack-subtitle3',
      color: 'red',
      list: [
        {
          name: 'react-tl',
          src: ReactTl
        },
        {
          name: 'jest',
          src: Jest
        },
        {
          name: 'vitest',
          src: Vitest
        },
        {
          name: 'cypress',
          src: Cypress
        },
        {
          name: 'mocha',
          src: Mocha
        },
        {
          name: 'chai',
          src: Chai
        }
      ]

    },
    {
      title: 'my-expertise.tech-stack-subtitle4',
      color: 'purple',
      list: [
        {
          name: 'aws',
          src: AWS
        },
        {
          name: 'firebase',
          src: Firebase
        },
        {
          name: 'jira',
          src: JIRA
        },
        {
          name: 'sentry',
          src: SENTRY
        },
        {
          name: 'github',
          src: GITHUB
        },
        {
          name: 'docker',
          src: DOCKER
        }
      ]
    }
  ]

  const [t] = useTranslation()
  return (
    <div id='my-expertise' className='expertise-container'>
      <h1>{t('my-expertise.title')}</h1>
        <div className='expertise-wrapper'>
          {expertiseData.map((expertise) => (
            <div key={expertise.title} className='expertise-card'>
              <h3 style={{backgroundColor: expertise.color, padding: '5px', borderRadius: '50px', width: 150}}>{t(expertise.title)}</h3>
              <div className='expertise-list'>
              {expertise.list.map((list, index) => (
                <img key={index} style={list.name === 'express' || list.name === 'cypress' || list.name === 'aws' ? {width: 70, height: 50, backgroundColor: 'white', borderRadius: '10px', padding: 1} : {width: 50, height: 50}} src={list.src} alt={expertise.title}  />
                ))}
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default MyExpertise