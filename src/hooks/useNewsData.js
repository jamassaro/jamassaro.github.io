import { useState, useEffect } from 'react';

/**
 * Hook to fetch news from the static news.json file
 * This replaces the RSS2JSON API calls with a single static file fetch
 */
function useNewsData() {
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/news.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load news: ${response.status}`);
        }
        
        const data = await response.json();
        
        setAllNews(data.articles || []);
        setLastUpdated(data.lastUpdated);
        
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.message);
        setAllNews([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []); // Fetch once on mount
  
  return {
    allNews,
    loading,
    error,
    lastUpdated,
  };
}

export default useNewsData;
