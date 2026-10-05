// ============================================================
// Context — Global Search Overlay
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SearchResultItem } from '../types/search';
import { searchAll, getRecentSearches, addRecentSearch, clearRecentSearches } from '../services/search';

interface SearchContextValue {
  isOpen: boolean;
  toggleSearch: (open?: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  results: SearchResultItem[];
  loading: boolean;
  recentSearches: string[];
  executeSearch: (q: string) => Promise<void>;
  selectRecent: (q: string) => void;
  clearRecent: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches);

  const toggleSearch = (open?: boolean) => {
    setIsOpen((prev) => {
      const next = open !== undefined ? open : !prev;
      if (!next) {
        setQuery('');
        setResults([]);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await searchAll(query);
      setResults(data);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const executeSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) return;
    setLoading(true);
    const updatedRecents = addRecentSearch(q);
    setRecentSearches(updatedRecents);
    const data = await searchAll(q);
    setResults(data);
    setLoading(false);
  };

  const selectRecent = (q: string) => {
    setQuery(q);
    executeSearch(q);
  };

  const clearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        toggleSearch,
        query,
        setQuery,
        results,
        loading,
        recentSearches,
        executeSearch,
        selectRecent,
        clearRecent,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
