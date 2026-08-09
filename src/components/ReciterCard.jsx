import React from 'react';
import { Heart, Music, Layers, PlayCircle } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAudio } from '../context/AudioContext';

export function ReciterCard({ reciter, onSelectReciter }) {
  const { isReciterFavorite, toggleFavoriteReciter } = useFavorites();
  const { currentReciter } = useAudio();

  const isFav = isReciterFavorite(reciter.id);
  const isSelected = currentReciter?.id === reciter.id;
  const moshafCount = reciter.moshaf?.length || 0;
  const primaryMoshaf = reciter.moshaf?.[0];
  const totalSurahs = primaryMoshaf?.surah_total || 0;

  return (
    <div className={`reciter-card ${isSelected ? 'selected' : ''}`}>
      <div className="reciter-header">
        {/* Reciter Avatar */}
        <div className="reciter-avatar" style={{ background: reciter.defaultAvatar?.color }}>
          <span>{reciter.defaultAvatar?.initial || reciter.letter || 'ق'}</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteReciter(reciter.id);
          }}
          className={`fav-btn ${isFav ? 'favorited' : ''}`}
          title={isFav ? 'إزالة القارئ من المفضلة' : 'إضافة القارئ للمفضلة'}
        >
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="reciter-body">
        <h3 className="reciter-name">{reciter.name}</h3>

        <div className="reciter-info-tags">
          <span className="info-tag">
            <Layers size={13} />
            <span>{moshafCount} {moshafCount > 1 ? 'روايات' : 'رواية'}</span>
          </span>
          <span className="info-tag">
            <Music size={13} />
            <span>{totalSurahs} سورة</span>
          </span>
        </div>

        {/* Moshaf Rewaya list badges */}
        <div className="moshaf-badges-preview">
          {reciter.moshaf?.slice(0, 2).map(m => (
            <span key={m.id} className="rewaya-badge truncate" title={m.name}>
              {m.name}
            </span>
          ))}
          {moshafCount > 2 && (
            <span className="rewaya-badge more">+{moshafCount - 2}</span>
          )}
        </div>
      </div>

      <div className="reciter-footer">
        <button
          onClick={() => onSelectReciter(reciter)}
          className="select-reciter-btn"
        >
          <PlayCircle size={18} />
          <span>تصفح واستماع التلاوات</span>
        </button>
      </div>
    </div>
  );
}
