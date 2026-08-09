import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, UserCheck, ChevronDown } from 'lucide-react';
import { SurahCard } from '../components/SurahCard';
import { matchArabicSearch } from '../utils/arabicSearch';
import { useAudio } from '../context/AudioContext';

export function SurahsView({ suwarList, recitersList, onOpenReciterModal }) {
  const { currentReciter, currentMoshaf } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'makkia' | 'madania'
  const [selectedReciterId, setSelectedReciterId] = useState(null);

  // اختيار القارئ النشط للتصفح
  const activeReciter = useMemo(() => {
    if (selectedReciterId) {
      return recitersList.find(r => r.id === selectedReciterId) || recitersList[0];
    }
    return currentReciter || recitersList[0];
  }, [selectedReciterId, currentReciter, recitersList]);

  const activeMoshaf = useMemo(() => {
    if (currentReciter?.id === activeReciter?.id && currentMoshaf) {
      return currentMoshaf;
    }
    return activeReciter?.moshaf?.[0];
  }, [activeReciter, currentReciter, currentMoshaf]);

  const filteredSurahs = useMemo(() => {
    return suwarList.filter(surah => {
      // تصفية حسب النوع مكية/مدنية
      if (filterType === 'makkia' && surah.makkia !== 1) return false;
      if (filterType === 'madania' && surah.makkia !== 0) return false;

      // تصفية حسب نص البحث باللغة العربية
      return matchArabicSearch(surah.name, searchQuery) || surah.id.toString() === searchQuery.trim();
    });
  }, [suwarList, searchQuery, filterType]);

  const makkiaCount = useMemo(() => suwarList.filter(s => s.makkia === 1).length, [suwarList]);
  const madaniaCount = useMemo(() => suwarList.filter(s => s.makkia === 0).length, [suwarList]);

  return (
    <div className="view-container">
      {/* Hero Header Section */}
      <div className="hero-banner">
        <div className="hero-content text-center">
          <h2 className="hero-title">فهرس سور القرآن الكريم</h2>
          <p className="hero-description">
            تصفح واستمع إلى سور القرآن الكريم الـ 114 بصوت نخبة من كبار القراء العالميين.
          </p>

          {/* Reciter Selector inside Hero */}
          <div className="hero-reciter-bar">
            <span className="flex items-center gap-2 text-muted text-sm font-medium">
              <UserCheck size={18} className="text-amber-500" />
              <span>القارئ المختار للتلاوة:</span>
            </span>
            {recitersList && recitersList.length > 0 && (
              <div className="reciter-dropdown-wrapper">
                <select
                  value={activeReciter?.id || ''}
                  onChange={(e) => setSelectedReciterId(parseInt(e.target.value, 10))}
                  className="hero-reciter-select"
                >
                  {recitersList.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.moshaf?.[0]?.name || 'المصحف المرتب'})
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="dropdown-arrow" />
              </div>
            )}

            {activeReciter && (
              <button
                onClick={() => onOpenReciterModal(activeReciter)}
                className="view-reciter-details-btn"
                title="عرض كافة روايات وسور هذا القارئ"
              >
                تصفح القارئ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="controls-section max-w-7xl mx-auto">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="ابحث باسم السورة (مثال: الفاتحة، الكهف، البقرة) أو برقمها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="main-search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-btn">
              مسح
            </button>
          )}
        </div>

        <div className="filters-wrapper">
          <div className="filter-buttons">
            <button
              onClick={() => setFilterType('all')}
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            >
              الكل ({suwarList.length})
            </button>
            <button
              onClick={() => setFilterType('makkia')}
              className={`filter-btn ${filterType === 'makkia' ? 'active' : ''}`}
            >
              مكية ({makkiaCount})
            </button>
            <button
              onClick={() => setFilterType('madania')}
              className={`filter-btn ${filterType === 'madania' ? 'active' : ''}`}
            >
              مدنية ({madaniaCount})
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Surahs */}
      <main className="main-content-area max-w-7xl mx-auto">
        {filteredSurahs.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} className="empty-icon" />
            <h3 className="empty-title">لم يتم العثور على أي سورة</h3>
            <p className="empty-desc">جرّب البحث باسم آخر أو تغيير التصفية</p>
          </div>
        ) : (
          <div className="surahs-grid">
            {filteredSurahs.map(surah => (
              <SurahCard
                key={surah.id}
                surah={surah}
                activeReciter={activeReciter}
                activeMoshaf={activeMoshaf}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
