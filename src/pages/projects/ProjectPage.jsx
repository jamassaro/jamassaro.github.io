import React from 'react'
import './projects.css'


const ProjectPage = () => {
  const projectName = 'BRAVE UP!'
  return (
        <div className='project-page-container'>
          <div className='project-title'>
            <h1>Project Name:</h1>
            <h2>{projectName}</h2>
          </div>
          <div className='project-information-container'>
          <div className='description-container'>
            <h3>Description:</h3>
            <p>The standard chunk of Lorem Ipsum used since 
                the 1500s is reproduced below for those interested. 
                Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"
                  by Cicero are also reproduced in their exact original form, accompanied by 
                  English versions from the 1914 translation by H. Rackham.
            </p>
          </div>
          <div className='description-container'>
            <h3>Stack Used</h3>
            <p>The standard chunk of Lorem Ipsum used since 
                the 1500s is reproduced below for those interested. 
                Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"
                  by Cicero are also reproduced in their exact original form, accompanied by 
                  English versions from the 1914 translation by H. Rackham.
            </p>
          </div>
          </div>
          <div>
            <h3>Photos</h3>
          </div>
        </div>
  )
}

export default ProjectPage