// recentSearchItems.tsx
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  };

  const saveRecentSearch = async (query: string) => {
    try {
      let searches = recentSearches;
      if (!searches.includes(query)) {
        searches = [query, ...searches];
        if (searches.length > 10) searches.pop();
        setRecentSearches(searches);
        await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
      }
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  const clearRecentSearch = async (query: string) => {
    try {
      const updatedSearches = recentSearches.filter(search => search !== query);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Failed to clear recent search:', error);
    }
  };

  const clearAllRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem('recentSearches');
    } catch (error) {
      console.error('Failed to clear all recent searches:', error);
    }
  };

  return {
    recentSearches,
    saveRecentSearch,
    clearRecentSearch,
    clearAllRecentSearches,
  };
};
