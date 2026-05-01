import { logger } from "../utils/logger";
import { useState, useEffect } from 'react';
import { fetchElectionNews } from '../services/externalApi';
import { NewsItem } from '../types';

export const useElectionNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      setLoadingNews(true);
      try {
        const fetchedNews = await fetchElectionNews();
        setNews(fetchedNews);
      } catch (error) {
        logger.error("Failed to load news", error);
      } finally {
        setLoadingNews(false);
      }
    };
    getNews();
  }, []);

  return { news, loadingNews };
};
