import useNewsAnalysis from '../../hooks/useNewsAnalysis';
import styles from './NewsAnalysisSection.module.css';
import { AnimatedSection, SectionTitle } from '../ui';

const NewsAnalysisSection = () => {
  const { analysis, loading, hasAnalysis } = useNewsAnalysis();

  // Don't render section if no analysis available
  if (!hasAnalysis && !loading) {
    return null;
  }

  if (loading) {
    return (
      <section className={styles.analysisSection}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading AI analysis...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="news-analysis" className={styles.analysisSection}>
      <div className={styles.container}>
        <AnimatedSection animation="fadeInUp">
          <SectionTitle 
            title='AI Analysis'
            index="05"
            indexLabel='Today's Briefing'
            subtitle='AI-powered insights and trends from today's technology news.'
          />
        </AnimatedSection>

        <div className={styles.analysisContent}>
          {/* Executive Summary */}
          {analysis.executiveSummary && (
            <AnimatedSection animation="fadeInUp" delay={100}>
              <div className={styles.executiveSummary}>
                <div className={styles.summaryIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.summaryContent}>
                  <h3 className={styles.summaryTitle}>Executive Summary</h3>
                  <p className={styles.summaryText}>{analysis.executiveSummary}</p>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Key Takeaways */}
          {analysis.takeaways?.length > 0 && (
            <AnimatedSection animation="fadeInUp" delay={200}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>📊</span>
                  Today's Takeaways
                </h3>
                <div className={styles.takeawaysGrid}>
                  {analysis.takeaways.map((takeaway, index) => (
                    <div key={index} className={styles.takeawayCard}>
                      <div className={styles.takeawayNumber}>{String(index + 1).padStart(2, '0')}</div>
                      <div className={styles.takeawayContent}>
                        <h4 className={styles.takeawayTitle}>{takeaway.title}</h4>
                        <p className={styles.takeawayDescription}>{takeaway.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Trending Topics */}
          {analysis.trends?.length > 0 && (
            <AnimatedSection animation="fadeInUp" delay={300}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>🔥</span>
                  Emerging Trends
                </h3>
                <div className={styles.trendTags}>
                  {analysis.trends.map((trend, index) => (
                    <span key={index} className={styles.trendTag}>
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Two Column Layout */}
          <div className={styles.twoColumnLayout}>
            {/* Worth Watching */}
            {analysis.worthWatching?.length > 0 && (
              <AnimatedSection animation="fadeInUp" delay={400}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>👀</span>
                    Worth Watching
                  </h3>
                  <ul className={styles.bulletList}>
                    {analysis.worthWatching.map((item, index) => (
                      <li key={index} className={styles.bulletItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Engineering Perspective */}
            {analysis.engineeringPerspective?.length > 0 && (
              <AnimatedSection animation="fadeInUp" delay={500}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>💡</span>
                    Engineering Perspective
                  </h3>
                  <ul className={styles.bulletList}>
                    {analysis.engineeringPerspective.map((item, index) => (
                      <li key={index} className={styles.bulletItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Statistics Footer */}
          {analysis.statistics && (
            <AnimatedSection animation="fadeInUp" delay={600}>
              <div className={styles.statsFooter}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{analysis.statistics.totalArticles}</span>
                  <span className={styles.statLabel}>Articles Analyzed</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{analysis.statistics.totalSources}</span>
                  <span className={styles.statLabel}>News Sources</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>
                    {new Date(analysis.generatedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className={styles.statLabel}>Last Updated</span>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsAnalysisSection;
