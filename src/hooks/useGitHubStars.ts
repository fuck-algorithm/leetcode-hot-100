import { useState, useEffect } from 'react';

const CACHE_KEY = 'github_stars_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1小时缓存

interface CacheData {
  stars: number;
  timestamp: number;
}

export function useGitHubStars(owner: string, repo: string) {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStars = async () => {
      // 检查缓存
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: CacheData = JSON.parse(cached);
        if (Date.now() - data.timestamp < CACHE_DURATION) {
          setStars(data.stars);
          setLoading(false);
          return;
        }
      }

      // 缓存过期或不存在，请求 API
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (res.ok) {
          const json = await res.json();
          const starCount = json.stargazers_count;
          setStars(starCount);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            stars: starCount,
            timestamp: Date.now()
          }));
        }
      } catch (e) {
        console.error('Failed to fetch GitHub stars:', e);
      }
      setLoading(false);
    };

    fetchStars();
  }, [owner, repo]);

  return { stars, loading };
}
