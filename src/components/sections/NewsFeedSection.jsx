
import useGetDataNews from '../../hooks/useGetDataNews';
import { useEffect } from 'react';
import styles from './NewFeed.module.css';
import { AnimatedSection, SectionTitle } from '../ui';

const NewsFeedSection = () => {
  const { news, loading, error, fetchNews } = useGetDataNews();

  useEffect(() => {
    fetchNews('https://feeds.macrumors.com/MacRumors-All');
  }, []);

  console.log('news:', news);

  if (loading) {
    return <div>Loading news...</div>;
  }

  if (error) {
    return <div>Error loading news: {error}</div>;
  }

  return (
    <section className={styles.newsFeedSection}>
      <div className={styles.container}>
          <AnimatedSection animation="fadeInUp">
          <SectionTitle 
            title='News Feed'
            index="04"
            indexLabel='Latest Updates'
            subtitle='Stay informed with the latest news and insights from the tech world.'
          />
          
          {/* <p className={styles.newsIntro}>
            Stay updated with the latest news and insights from the tech world. Our curated news feed brings you the most relevant articles, trends, and updates to keep you informed and ahead of the curve.
          </p> */}
        </AnimatedSection>
        <div>
          <h3 className={styles.newsSource}>TECHCRUNCH</h3>
          <ul className={styles.newsList}>
            {news.map((item, index) => (
              <li key={index} className={styles.newsItem}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default NewsFeedSection;
