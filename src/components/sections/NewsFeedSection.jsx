
import useGetDataNews from '../../hooks/useGetDataNews';
import { useEffect, useState } from 'react';
import styles from './NewFeed.module.css';
import { AnimatedSection, SectionTitle } from '../ui';

const NewsFeedSection = () => {
  const { news, loading, error, fetchNews } = useGetDataNews();
  const [activeSource, setActiveSource] = useState('TECHCRUNCH');

  const NEWS_SOURCES = [
    { id: 'TECHCRUNCH', label: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    { id: 'THE_VERGE', label: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
    { id: 'MACRUMORS', label: 'MacRumors', url: 'https://feeds.macrumors.com/MacRumors-All' },
    { id: '9TO5MAC', label: '9to5Mac', url: 'https://9to5mac.com/feed/' },
  ];

  // Load default source on mount
  useEffect(() => {
    fetchNews(NEWS_SOURCES[0].url);
  }, []);

  const handleSourceClick = (source) => {
    if (source.id === activeSource) return; // Prevent unnecessary refetch
    setActiveSource(source.id);
    fetchNews(source.url);
  };

  return (
    <section className={styles.newsFeedSection}>
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
                disabled={loading}
              >
                {source.label}
              </button>
            ))}
          </div>

          {/* News List - Keep content visible during loading to prevent layout shift */}
          <div className={`${styles.newsListWrapper} ${loading ? styles.loading : ''}`}>
            {error && (
              <div className={styles.errorState}>
                <p>Failed to load news: {error}</p>
              </div>
            )}

            {!error && news.length > 0 && (
              <ul className={styles.newsList}>
                {news.map((item, index) => (
                  <li key={item.link || index} className={styles.newsItem}>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.newsLink}
                    >
                      <h4 className={styles.newsTitle}>{item.title}</h4>
                      {item.description && (
                        <p className={styles.newsDescription}>
                          {item.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                        </p>
                      )}
                      <span className={styles.newsDate}>
                        {new Date(item.pubDate).toLocaleDateString('en-US', {
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

            {!error && news.length === 0 && !loading && (
              <div className={styles.emptyState}>
                <p>No news available from this source.</p>
              </div>
            )}

            {/* Loading overlay */}
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
