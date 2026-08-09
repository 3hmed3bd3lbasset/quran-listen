import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('quran_favorites');
      return saved ? JSON.parse(saved) : { surahs: [], reciters: [] };
    } catch {
      return { surahs: [], reciters: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem('quran_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavoriteSurah = (surahId) => {
    setFavorites(prev => {
      const isFav = prev.surahs.includes(surahId);
      const updated = isFav
        ? prev.surahs.filter(id => id !== surahId)
        : [...prev.surahs, surahId];
      return { ...prev, surahs: updated };
    });
  };

  const toggleFavoriteReciter = (reciterId) => {
    setFavorites(prev => {
      const isFav = prev.reciters.includes(reciterId);
      const updated = isFav
        ? prev.reciters.filter(id => id !== reciterId)
        : [...prev.reciters, reciterId];
      return { ...prev, reciters: updated };
    });
  };

  const isSurahFavorite = (surahId) => favorites.surahs.includes(surahId);
  const isReciterFavorite = (reciterId) => favorites.reciters.includes(reciterId);

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavoriteSurah,
      toggleFavoriteReciter,
      isSurahFavorite,
      isReciterFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
