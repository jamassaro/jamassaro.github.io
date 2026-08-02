import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './WorkExperience.module.css';
import GlassCard from '../ui/GlassCard';
import TechTag from '../ui/TechTag';
import SectionTitle from '../ui/SectionTitle';
import AnimatedSection from '../ui/AnimatedSection';
import Innovare from '../../assets/logos/companies/Innovare.png';
import Glampi from '../../assets/logos/companies/glampi.jpg';
import Avattar from '../../assets/logos/companies/avattar.png';
 // Import the Innovare icon

// Icons placeholder - can be replaced with actual icons
const InnovareIcon = () => (
  <img src={Innovare} alt="Innovare Icon" width="32" height="32" />
);

const GlampiIcon = () => (
  <img src={Glampi} alt="Glampi Icon" width="32" height="32" />
);

const AvattarIcon = () => (
  <img src={Avattar} alt="Avattar Icon" width="32" height="32" />
);

const WorkExperienceSection = () => {
  const { t } = useTranslation();

  const icons = [<InnovareIcon />, <GlampiIcon />, <AvattarIcon />];
  const companyLinks = [
    'https://innovaresip.com/',
    'https://glampi.com/',
    'https://avattar.com/',
  ];

  return (
    <section id="work-experience" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <AnimatedSection animation="fadeInUp">
          <SectionTitle 
            title={t('work.company')}
            index="02"
            indexLabel={t('work.tag')}
          />
          
          <p className={styles.ventureIntro}>
            {t('work.description')}
          </p>
        </AnimatedSection>

        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          {[0, 1, 2].map((index) => (
            <AnimatedSection 
              key={index}
              animation="fadeInUp"
              delay={index * 0.1}
            >
              <GlassCard 
                variant="default"
                hoverable
                className={styles.featureCard}
              >
                <div className={styles.featureIcon}>
                  {icons[index]}
                </div>
                
                <h3 className={styles.featureTitle}>
                  {t(`work.cards.${index}.title`)}
                </h3>
                
                <p className={styles.featureDescription}>
                  {t(`work.cards.${index}.description`)}
                </p>
                
                <div className={styles.techStack}>
                  {t(`work.cards.${index}.technologies`, { returnObjects: true }).map((tech, techIndex) => (
                    <TechTag 
                      key={techIndex}
                      color="cyan"
                      size="small"
                    >
                      {tech}
                    </TechTag>
                  ))}
                </div>
                <a 
                  href={companyLinks[index]}
                  className={styles.caseStudyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('work.link') || 'Visit Website'}
                  <span className={styles.arrow}>→</span>
                </a>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperienceSection;
