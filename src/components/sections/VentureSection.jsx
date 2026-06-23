import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './VentureSection.module.css';
import GlassCard from '../ui/GlassCard';
import TechTag from '../ui/TechTag';
import SectionTitle from '../ui/SectionTitle';
import AnimatedSection from '../ui/AnimatedSection';

// Icons placeholder - can be replaced with actual icons
const PlatformIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 8h10M7 12h10M7 16h6" />
  </svg>
);

const MarketingIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const AdminIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const VentureSection = () => {
  const { t } = useTranslation();

  const icons = [<PlatformIcon />, <MarketingIcon />, <AdminIcon />];

  return (
    <section id="entrepreneurship" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <AnimatedSection animation="fadeInUp">
          <SectionTitle 
            title={t('venture.company')}
            index="03"
            indexLabel={t('venture.tag')}
            subtitle={t('venture.role')}
          />
          
          <p className={styles.ventureIntro}>
            {t('venture.description')}
          </p>
          
          <a 
            href="https://www.braveup.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.websiteLink}
          >
            <span>Visit Website</span>
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </AnimatedSection>

        {/* Metrics Row */}
        <div className={styles.metricsRow}>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>
              {t('venture.metrics.users')}
            </span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>
              {t('venture.metrics.schools')}
            </span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>
              {t('venture.metrics.countries')}
            </span>
          </div>
        </div>

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
                  {t(`venture.cards.${index}.title`)}
                </h3>
                
                <p className={styles.featureDescription}>
                  {t(`venture.cards.${index}.description`)}
                </p>
                
                <div className={styles.techStack}>
                  {t(`venture.cards.${index}.technologies`, { returnObjects: true }).map((tech, techIndex) => (
                    <TechTag 
                      key={techIndex}
                      color="cyan"
                      size="small"
                    >
                      {tech}
                    </TechTag>
                  ))}
                </div>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VentureSection;
