import React from 'react';
import { GlassCard, TerminalHeader, SectionTitle } from '../ui';
import { expertiseCategories } from '../../data/expertise';
import styles from './ExpertiseSection.module.css';
import { useTranslation } from 'react-i18next';

/**
 * ExpertiseSection Component - SRP: Handles expertise showcase rendering
 * Features: Grid layout with glassmorphism cards, tech stack display
 */
const ExpertiseSection = () => {
  const [t] = useTranslation(); // Translation function
  return (
    <section id="expertise" className={styles.expertise}>
      <div className={styles.container}>
        <SectionTitle
          index="01"
          indexLabel={t('expertise.tag')}
          title={t('expertise.title')}
          subtitle={t('expertise.description')}
        />

        <div className={styles.grid}>
          {expertiseCategories.map((category) => (
            <GlassCard
              key={category.id}
              variant={category.color === 'blue' ? 'primary' : category.color === 'green' ? 'secondary' : 'default'}
              hoverable
              withTerminal
              className={styles.expertiseCard}
            >
              <TerminalHeader label={t(category.label)} />
              
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{t(category.title)}</h3>
                <span className={`${styles.categoryLabel} ${styles[category.color]}`}>
                  {category.color}
                </span>
              </div>

              <p className={styles.description}>{t(category.description)}</p>

              <div className={styles.techGrid}>
                {category.technologies.map((tech) => (
                  <div key={tech.name} className={styles.techItem}>
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className={`${styles.techIcon} ${tech.invertOnDark ? styles.invertOnDark : ''}`}
                    />
                    <span className={styles.techName}>{tech.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
