import React, { useState, useMemo } from 'react';
import { Search, Users, Sparkles, Filter } from 'lucide-react';
import { ReciterCard } from '../components/ReciterCard';
import { matchArabicSearch, normalizeArabic } from '../utils/arabicSearch';

const ARABIC_LETTERS = [
  'الكل', 'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
];

export function RecitersView({ recitersList, onSelectReciter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('الكل');

  const filteredReciters = useMemo(() => {
    return recitersList.filter(reciter => {
      // تصفية حسب الحرف
      if (selectedLetter !== 'الكل') {
        const letterNorm = normalizeArabic(selectedLetter);
        const reciterLetterNorm = normalizeArabic(reciter.letter || reciter.name.charAt(0));
        if (letterNorm !== reciterLetterNorm) {
          return false;
        }
      }

      // تصفية حسب نص البحث باللغة العربية
      return matchArabicSearch(reciter.name, searchQuery);
    });
  }, [recitersList, searchQuery, selectedLetter]);

  return (
    <div className="view-container">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold mb-3">
            <Sparkles size={14} />
            <span>نخبة القراء العالميّين</span>
          </div>
          <h2 className="hero-title">دليل قراء القرآن الكريم</h2>
          <p className="hero-description">
            تصفح قائمة تضم أكثر من {recitersList.length} قارئاً بروايات مختلفة (حفص، ورش، قالون، الدوري وغيرها) واستمع إلى تلاواتهم العذبة.
          </p>
        </div>
      </div>

      {/* Controls: Search & Letter Index */}
      <div className="controls-section max-w-7xl mx-auto">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="ابحث باسم القارئ (مثال: عبد الباسط، المعيقلي، الحصري)..."
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

        {/* Alphabetical Filter Bar */}
        <div className="letters-filter-container">
          <div className="letters-scroll font-medium">
            {ARABIC_LETTERS.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`letter-btn ${selectedLetter === letter ? 'active' : ''}`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reciters Grid */}
      <main className="main-content-area max-w-7xl mx-auto">
        {filteredReciters.length === 0 ? (
          <div className="empty-state">
            <Users size={48} className="empty-icon" />
            <h3 className="empty-title">لم يتم العثور على أي قارئ</h3>
            <p className="empty-desc">تأكد من كتابة الاسم بشكل صحيح أو اختر حتماً حرفاً آخر</p>
          </div>
        ) : (
          <div className="reciters-grid">
            {filteredReciters.map(reciter => (
              <ReciterCard
                key={reciter.id}
                reciter={reciter}
                onSelectReciter={onSelectReciter}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
