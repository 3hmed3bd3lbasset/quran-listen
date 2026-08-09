import React from 'react';
import { Play, Pause, Heart, BookOpen } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useFavorites } from '../context/FavoritesContext';
import { DownloadButton } from './DownloadButton';

export function SurahCard({ surah, activeReciter, activeMoshaf }) {
  const { currentSurah, isPlaying, playSurah, togglePlayPause } = useAudio();
  const { isSurahFavorite, toggleFavoriteSurah } = useFavorites();

  const isCurrentPlaying = currentSurah?.id === surah.id && isPlaying;
  const isCurrentActive = currentSurah?.id === surah.id;
  const isFav = isSurahFavorite(surah.id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrentActive) {
      togglePlayPause();
    } else {
      playSurah(surah, activeReciter, activeMoshaf);
    }
  };

  return (
    <div className={`surah-card ${isCurrentActive ? 'active-playing' : ''}`}>
      {/* Surah Number Badge */}
      <div className="surah-number-badge">
        <span>{surah.id}</span>
      </div>

      {/* Surah Details */}
      <div className="surah-card-content">
        <div className="flex items-center gap-2">
          <h3 className="surah-title">{surah.name}</h3>
          <span className={`surah-type-tag ${surah.makkia === 1 ? 'makkia' : 'madania'}`}>
            {surah.makkia === 1 ? 'مكية' : 'مدنية'}
          </span>
        </div>

        <div className="surah-meta">
          <span className="flex items-center gap-1">
            <BookOpen size={13} />
            <span>الصفحات: {surah.start_page} - {surah.end_page}</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="surah-card-actions">
        {/* Favorite toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteSurah(surah.id);
          }}
          className={`fav-btn ${isFav ? 'favorited' : ''}`}
          title={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>

        {/* Download Button */}
        {activeMoshaf && (
          <DownloadButton surah={surah} reciter={activeReciter} moshaf={activeMoshaf} />
        )}

        {/* Play/Pause Button */}
        <button
          onClick={handlePlayClick}
          className={`surah-play-btn ${isCurrentPlaying ? 'playing' : ''}`}
          title={isCurrentPlaying ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
        >
          {isCurrentPlaying ? <Pause size={18} /> : <Play size={18} className="mr-0.5" />}
        </button>
      </div>
    </div>
  );
}
