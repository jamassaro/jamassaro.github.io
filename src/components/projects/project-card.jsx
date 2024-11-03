import React from "react";
import "./project-card.css"; // Import the CSS file for styling
import { useTranslation } from "react-i18next";

const ProjectCard = ({ projectName, technologies, description }) => {
  const [t] = useTranslation()
  return (
    <div className="project-card">
      <h2 className="project-name">{t(`${projectName}`)}</h2>
      <p className="project-description">{t(`${description}`)}</p>
      <div className="tech-list">
        {technologies.map((tech, index) => (
          <span key={index} className="tech-item">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProjectCard;