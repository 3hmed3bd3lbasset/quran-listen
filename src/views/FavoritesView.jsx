import React, { useMemo } from 'react';
import { Bookmark, Heart, BookOpen, Users } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { SurahCard } from '../components/SurahCard';
import { ReciterCard } from '../components/ReciterCard';
import { useAudio } from '../context/AudioContext';

export function FavoritesView({ suwarList, recitersList, onSelectReciter, onNavigate }) {
  const { favorites } = useFavorites();
  const { currentReciter, currentMoshaf } = useAudio();

  const favSurahs = useMemo(() => {
    if (!suwarList || !favorites.surahs) return [];
    const favSet = new Set(favorites.surahs);
    return suwarList.filter(s => favSet.has(s.id));
  }, [suwarList, favorites.surahs]);

  const favReciters = useMemo(() => {
    if (!recitersList || !favorites.reciters) return [];
    const favSet = new Set(favorites.reciters);
    return recitersList.filter(r => favSet.has(r.id));
  }, [recitersList, favorites.reciters]);

  const activeReciter = currentReciter || recitersList[0];
  const activeMoshaf = currentMoshaf || activeReciter?.moshaf?.[0];

  const isEmpty = favSurahs.length === 0 && favReciters.length === 0;

  return (
    <div className="view-container">
      {/* Hero Header */}
      <div className="hero-banner">
        <div className="hero-content text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-semibold mb-3">
            <Heart size={14} fill="currentColor" />
            <span>قائمتك المفضلة</span>
          </div>
          <h2 className="hero-title">السور والقراء المفضلون</h2>
          <p className="hero-description">
            مكانك المخصص للوصول السريع إلى التلاوات والقراء الذين تفضل الاستماع إليهم دائماً.
          </p>
        </div>
      </div>

      <main className="main-content-area max-w-7xl mx-auto">
        {isEmpty ? (
          <div className="empty-state">
            <Bookmark size={56} className="empty-icon text-muted" />
            <h3 className="empty-title">قائمة المفضلة فارغة حالياً</h3>
            <p className="empty-desc">
              يمكنك إضافة أي سورة أو قارئ إلى المفضلة بالنقر على أيقونة القلب ❤️ أثناء التصفح.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => onNavigate('surahs')} className="primary-action-btn">
                <BookOpen size={18} />
                <span>تصفح السور</span>
              </button>
              <button onClick={() => onNavigate('reciters')} className="secondary-action-btn">
                <Users size={18} />
                <span>تصفح القراء</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Favorited Reciters Section */}
            {favReciters.length > 0 && (
              <section className="fav-section">
                <div className="section-title-wrapper">
                  <h3 className="section-title">
                    <Users size={22} className="text-amber-500" />
                    <span>القراء المفضلون ({favReciters.length})</span>
                  </h3>
                </div>
                <div className="reciters-grid">
                  {favReciters.map(reciter => (
                    <ReciterCard
                      key={reciter.id}
                      reciter={reciter}
                      onSelectReciter={onSelectReciter}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Favorited Surahs Section */}
            {favSurahs.length > 0 && (
              <section className="fav-section">
                <div className="section-title-wrapper">
                  <h3 className="section-title">
                    <BookOpen size={22} className="text-amber-500" />
                    <span>السور المفضلة ({favSurahs.length})</span>
                  </h3>
                </div>
                <div className="surahs-grid">
                  {favSurahs.map(surah => (
                    <SurahCard
                      key={surah.id}
                      surah={surah}
                      activeReciter={activeReciter}
                      activeMoshaf={activeMoshaf}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
