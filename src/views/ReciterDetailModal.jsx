import React, { useState, useMemo } from 'react';
import { X, Search, Layers, Music, Heart } from 'lucide-react';
import { SurahCard } from '../components/SurahCard';
import { matchArabicSearch } from '../utils/arabicSearch';
import { useFavorites } from '../context/FavoritesContext';

export function ReciterDetailModal({ reciter, suwarList, onClose }) {
  const { isReciterFavorite, toggleFavoriteReciter } = useFavorites();
  const [selectedMoshafId, setSelectedMoshafId] = useState(() => reciter?.moshaf?.[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');

  if (!reciter) return null;

  const currentMoshaf = useMemo(() => {
    return reciter.moshaf?.find(m => m.id === selectedMoshafId) || reciter.moshaf?.[0];
  }, [reciter, selectedMoshafId]);

  const availableSurahs = useMemo(() => {
    if (!currentMoshaf || !suwarList) return [];
    const availableIds = new Set(currentMoshaf.availableSurahs || []);
    return suwarList.filter(s => availableIds.has(s.id));
  }, [currentMoshaf, suwarList]);

  const filteredSurahs = useMemo(() => {
    return availableSurahs.filter(s => matchArabicSearch(s.name, searchQuery) || s.id.toString() === searchQuery.trim());
  }, [availableSurahs, searchQuery]);

  const isFav = isReciterFavorite(reciter.id);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content-card max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="flex items-center gap-4">
            <div className="reciter-avatar modal-avatar" style={{ background: reciter.defaultAvatar?.color }}>
              <span>{reciter.defaultAvatar?.initial || 'ق'}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="modal-reciter-title">{reciter.name}</h2>
                <button
                  onClick={() => toggleFavoriteReciter(reciter.id)}
                  className={`fav-btn ${isFav ? 'favorited' : ''}`}
                  title={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                >
                  <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className="modal-reciter-subtitle">
                تلاوات المصحف الشريف - المتاحة ({availableSurahs.length} سورة)
              </p>
            </div>
          </div>

          <button onClick={onClose} className="modal-close-btn" title="إغلاق">
            <X size={22} />
          </button>
        </div>

        {/* Moshaf Rewaya Selector Tabs */}
        {reciter.moshaf && reciter.moshaf.length > 1 && (
          <div className="moshaf-tabs-container">
            <span className="tabs-label flex items-center gap-1">
              <Layers size={16} />
              <span>الرواية / المصحف:</span>
            </span>
            <div className="moshaf-tabs-scroll">
              {reciter.moshaf.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMoshafId(m.id)}
                  className={`moshaf-tab-btn ${selectedMoshafId === m.id ? 'active' : ''}`}
                >
                  {m.name}
                  <span className="count-badge">{m.availableSurahs?.length || 0} سورة</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Inner Search Box */}
        <div className="modal-search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="ابحث عن سورة داخل تلاوات القارئ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="modal-search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search-btn">
              مسح
            </button>
          )}
        </div>

        {/* Surahs Grid */}
        <div className="modal-surahs-scroll-area">
          {filteredSurahs.length === 0 ? (
            <div className="empty-state">
              <Music size={40} className="empty-icon" />
              <p>لا توجد سور مطابقة لـ "{searchQuery}" لهذا القارئ</p>
            </div>
          ) : (
            <div className="surahs-grid">
              {filteredSurahs.map(surah => (
                <SurahCard
                  key={surah.id}
                  surah={surah}
                  activeReciter={reciter}
                  activeMoshaf={currentMoshaf}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
