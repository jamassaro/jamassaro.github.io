import React from "react";
import "./project-card.css"; // Import the CSS file for styling

const ProjectCard = ({ projectName, technologies }) => {
  return (
    <div className="project-card">
      <h2 className="project-name">{projectName}</h2>
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