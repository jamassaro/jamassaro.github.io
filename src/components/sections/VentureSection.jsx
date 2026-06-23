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

  const features = [
    {
      id: 'platform',
      icon: <PlatformIcon />,
      title: 'Platform',
      description: 'Main web app and mobile experience for schools and students.',
      technologies: [
        { name: 'Next.js', color: 'cyan' },
        { name: 'R.N.', color: 'blue' },
        { name: 'PostgreSQL', color: 'emerald' }
      ]
    },
    {
      id: 'marketing',
      icon: <MarketingIcon />,
      title: 'Marketing',
      description: 'Marketing site and analytics for K-12 institutions.',
      technologies: [
        { name: 'GA4', color: 'cyan' },
        { name: 'Google Remarketing', color: 'purple' }
      ]
    },
    {
      id: 'admin',
      icon: <AdminIcon />,
      title: 'Admin Tool',
      description: 'Administrative platform and dashboard for system control.',
      technologies: [
        { name: 'Node.js', color: 'emerald' },
        { name: 'Firebase', color: 'yellow' },
        { name: 'GraphQL', color: 'pink' }
      ]
    }
  ];

  return (
    <section id="entrepreneurship" className={styles.section}>
      <div className={styles.container}>
        {/* Section Header */}
        <AnimatedSection animation="fadeInUp">
          <SectionTitle 
            title="Brave Up!"
            index="03"
            indexLabel="VENTURE"
            subtitle="CO-FOUNDER & CTO"
          />
          
          <p className={styles.ventureIntro}>
            Leading an AI-powered platform focused on helping schools detect, predict, and prevent bullying and 
            cyberbullying. We leverage advanced technology and analytics to provide schools with the tools they 
            need to create safer and more supportive environments for students.
          </p>
        </AnimatedSection>

        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <AnimatedSection 
              key={feature.id}
              animation="fadeInUp"
              delay={index * 0.1}
            >
              <GlassCard 
                variant="default"
                hoverable
                className={styles.featureCard}
              >
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                
                <h3 className={styles.featureTitle}>
                  {feature.title}
                </h3>
                
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
                
                <div className={styles.techStack}>
                  {feature.technologies.map((tech, techIndex) => (
                    <TechTag 
                      key={techIndex}
                      color={tech.color}
                      size="small"
                    >
                      {tech.name}
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
