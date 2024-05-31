import React from 'react'
import './myexpertise.css'
import { useTranslation } from 'react-i18next'

const MyExpertise = () => {

  const expertiseData = [
    {
      title: 'my-expertise.tech-stack-subtitle',
      list: ['React', 'HTML', 'CSS', 'SASS', 'd3', 'i18n']
    },
    {
      title: 'my-expertise.tech-stack-subtitle2',
      list: ['Node', 'Express', 'AdminJs', 'Strapi V3']
    },
    {
      title: 'my-expertise.tech-stack-subtitle3',
      list: ['React TL', 'Jest', 'Vitest', 'Cypress', 'Mocha', 'Chai']
    },
    {
      title: 'my-expertise.tech-stack-subtitle4',
      list: ['Firebase', 'AWS', 'Jira', 'Sentry', 'Intercom']
    }
  ]

  const [t] = useTranslation()
  return (
    <div id='my-expertise' className='expertise-container'>
      <h1>{t('my-expertise.title')}</h1>
        <div className='expertise-wrapper'>
          <div className='expertise-card'>
            <p>{t('my-expertise.description')}</p>
          </div>
            <div className='expertise-card'>
                <h3>{t('my-expertise.tech-stack')}</h3>
                  <div className='tech-stack-container'>
                 {expertiseData.map((data) => (
                     <div key={data.title} style={{with: 100}}>
                       <h4>{t(data.title)}</h4>
                        {data.list.map((list) => (
                          <p key={list}>{list}</p>
                        ))}
                     </div>
                   ))}
                </div>
            </div>
            <div className='expertise-card'>
                <h3>{t('my-expertise.current-learning')}</h3>
                <p>
                  {t('my-expertise.current-learning-description')}
                </p>
                <h4>{t('my-expertise.learning-process')}</h4>
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