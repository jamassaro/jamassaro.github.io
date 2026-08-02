import { useState } from 'react';

function useGetDataNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchNews = async (rssUrl) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use RSS2JSON API to convert RSS feed to JSON and handle CORS
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'ok') {
        const filteredItems = data.items.slice(0, 6)
        setNews(filteredItems);
      } else {
        throw new Error(data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    news,
    loading,
    error,
    fetchNews,
  };
}

export default useGetDataNews;