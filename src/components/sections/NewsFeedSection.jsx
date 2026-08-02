
import useNewsData from '../../hooks/useNewsData';
import { useState, useMemo } from 'react';
import styles from './NewFeed.module.css';
import { AnimatedSection, SectionTitle } from '../ui';

const NewsFeedSection = () => {
  const { allNews, loading, error } = useNewsData();
  const [activeSource, setActiveSource] = useState('ALL');

  const NEWS_SOURCES = [
    { id: 'ALL', label: 'All Sources' },
    { id: 'TechCrunch', label: 'TechCrunch' },
    { id: 'The Verge', label: 'The Verge' },
    { id: 'MacRumors', label: 'MacRumors' },
    { id: '9to5Mac', label: '9to5Mac' },
  ];

  // Filter news by selected source (client-side, instant)
  const filteredNews = useMemo(() => {
    if (activeSource === 'ALL') {
      return allNews;
    }
    return allNews.filter(article => article.source === activeSource);
  }, [allNews, activeSource]);

  const handleSourceClick = (source) => {
    setActiveSource(source.id);
  };

  return (
    <section id="news-feed" className={styles.newsFeedSection}>
      <div className={styles.container}>
        <AnimatedSection animation="fadeInUp">
          <SectionTitle 
            title='News Feed'
            index="06"
            indexLabel='Latest Updates'
            subtitle='Stay informed with the latest news and insights from the tech world.'
          />
        </AnimatedSection>

        <div className={styles.newsContent}>
          {/* Source Tabs */}
          <div className={styles.newsSources}>
            {NEWS_SOURCES.map((source) => (
              <button
                key={source.id}
                className={`${styles.newsSource} ${activeSource === source.id ? styles.active : ''}`}
                onClick={() => handleSourceClick(source)}
              >
                {source.label}
              </button>
            ))}
          </div>

          {/* News List */}
          <div className={`${styles.newsListWrapper} ${loading ? styles.loading : ''}`}>
            {error && (
              <div className={styles.errorState}>
                <p>Failed to load news: {error}</p>
              </div>
            )}

            {!error && filteredNews.length > 0 && (
              <ul className={styles.newsList}>
                {filteredNews.map((article) => (
                  <li key={article.id} className={styles.newsItem}>
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.newsLink}
                    >
                      <div className={styles.newsHeader}>
                        <span className={styles.newsSource}>{article.source}</span>
                        <span className={styles.newsCategory}>{article.category}</span>
                      </div>
                      <h4 className={styles.newsTitle}>{article.title}</h4>
                      {article.description && (
                        <p className={styles.newsDescription}>
                          {article.description.substring(0, 150)}
                          {article.description.length > 150 ? '...' : ''}
                        </p>
                      )}
                      <span className={styles.newsDate}>
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {!error && filteredNews.length === 0 && !loading && (
              <div className={styles.emptyState}>
                <p>No news available from this source.</p>
              </div>
            )}

            {/* Loading overlay - only shown on initial load */}
            {loading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.spinner}></div>
                <p>Loading latest news...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsFeedSection;
