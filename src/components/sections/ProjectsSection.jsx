import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProjectsSection.module.css';
import { projectsData } from '../../data/projects';
import GlassCard from '../ui/GlassCard';
import TechTag from '../ui/TechTag';
import SectionTitle from '../ui/SectionTitle';
import AnimatedSection from '../ui/AnimatedSection';

const ProjectsSection = () => {
  const { t } = useTranslation();

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <AnimatedSection animation="fadeInUp">
          <SectionTitle 
            title={t('navigation.projects') || 'Projects'}
            index="02"
            indexLabel="PROJECTS"
            subtitle="Featured work and case studies"
          />
        </AnimatedSection>

        {projectsData.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No projects yet</h3>
            <p>Check back soon for featured work and case studies.</p>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {projectsData.map((project, index) => (
              <AnimatedSection 
                key={project.id}
                animation="fadeInUp"
                delay={index * 0.1}
              >
                <GlassCard 
                  variant="default"
                  hoverable
                  className={styles.projectCard}
                >
                  {/* Project Image */}
                  <div className={styles.imageWrapper}>
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={t(project.titleKey)}
                        className={styles.projectImage}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <span className={styles.placeholderIcon}>{'{ }'}</span>
                      </div>
                    )}
                  </div>

                  {/* Project Title */}
                  <h3 className={styles.projectTitle}>
                    {t(project.titleKey)}
                  </h3>

                  {/* Project Description */}
                  <p className={styles.projectDescription}>
                    {t(project.descriptionKey)}
                  </p>

                  {/* Tech Stack */}
                  <div className={styles.techStack}>
                    {project.technologies.map((tech, techIndex) => (
                      <TechTag 
                        key={techIndex}
                        color={tech.color}
                        size="small"
                        icon={tech.icon}
                      >
                        {tech.name}
                      </TechTag>
                    ))}
                  </div>

                  {/* Case Study Link */}
                  {project.link ? (
                    <a 
                      href={project.link}
                      className={styles.caseStudyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Case Study
                      <span className={styles.arrow}>→</span>
                    </a>
                  ) : (
                    <span className={`${styles.caseStudyLink} ${styles.disabled}`}>
                      Case Study
                      <span className={styles.arrow}>→</span>
                    </span>
                  )}
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
