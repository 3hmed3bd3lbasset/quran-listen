import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gift, Heart, MessageCircle, Phone, Sparkles, 
  RotateCcw, CheckCircle2, BookOpen, Sun, Moon, Search, Loader2, Award, ArrowLeft
} from 'lucide-react';
import { getAzkarCategories, getAzkarItems, DEFAULT_TASBEEH } from '../services/azkarApi';

export function GiftView() {
  // Developer Details
  const devName = "Ahmed Abdelbaset Mohamed";
  const devPhone = "01285694670";
  const whatsappUrl = "https://wa.me/201285694670";

  // Azkar State
  const [activeAzkarTab, setActiveAzkarTab] = useState('tasbeeh'); // 'tasbeeh' | 'morning_evening' | 'supplications' | 'all_categories'
  
  // Interactive Digital Tasbeeh Counter State
  const [selectedTasbeeh, setSelectedTasbeeh] = useState(DEFAULT_TASBEEH[0]);
  const [tasbeehCounts, setTasbeehCounts] = useState(() => {
    try {
      const saved = localStorage.getItem('quran_tasbeeh_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Morning / Evening & API Azkar State
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState(27); // 27 = أذكار الصباح والمساء
  const [selectedCatTitle, setSelectedCatTitle] = useState('أذكار الصباح والمساء');
  const [azkarItems, setAzkarItems] = useState([]);
  const [loadingAzkar, setLoadingAzkar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemProgress, setItemProgress] = useState({});

  useEffect(() => {
    localStorage.setItem('quran_tasbeeh_counts', JSON.stringify(tasbeehCounts));
  }, [tasbeehCounts]);

  // Load API Categories on mount
  useEffect(() => {
    getAzkarCategories().then(cats => setCategories(cats));
  }, []);

  // Load Azkar items when category changes
  useEffect(() => {
    if (!selectedCatId) return;
    setLoadingAzkar(true);
    getAzkarItems(selectedCatId).then(items => {
      setAzkarItems(items);
      setLoadingAzkar(false);
    });
  }, [selectedCatId]);

  // Increments Tasbeeh counter
  const handleIncrementTasbeeh = (id) => {
    setTasbeehCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleResetTasbeeh = (id) => {
    setTasbeehCounts(prev => ({
      ...prev,
      [id]: 0
    }));
  };

  // Azkar item count click
  const handleItemCountClick = (itemId, maxRepeat) => {
    setItemProgress(prev => {
      const current = prev[itemId] || 0;
      if (current >= maxRepeat) return prev;
      return { ...prev, [itemId]: current + 1 };
    });
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter(c => c.TITLE && c.TITLE.includes(searchQuery));
  }, [categories, searchQuery]);

  const currentCount = tasbeehCounts[selectedTasbeeh.id] || 0;

  return (
    <div className="view-container">
      {/* DEVELOPER GIFT HERO BANNER */}
      <div className="hero-banner gift-hero">
        <div className="hero-content text-center max-w-3xl mx-auto">
          <div className="hero-gift-badge">
            <Gift size={14} />
            <span>هدية المنصة والتواصل مع المطور</span>
          </div>

          <h2 className="hero-title font-amiri">
            إهداء خاص وأذكار إسلامية مأثورة
          </h2>
          <p className="hero-description">
            تم بناء هذه المنصة لوجه الله تعالى لتكون صدقة جارية ومرجعاً عذباً لكل مسلم يستمع لكتاب الله ويذكر الله تعالى في كل حين.
          </p>

          {/* DEVELOPER CARD WITH DIRECT WHATSAPP ACTION */}
          <div className="dev-profile-card">
            <div className="dev-profile-inner">
              <div className="dev-info-left">
                <div className="dev-avatar">
                  <span>أ</span>
                </div>
                <div className="dev-details">
                  <span className="dev-role-tag">
                    <Sparkles size={12} />
                    <span>مطور المنصة</span>
                  </span>
                  <h3 className="dev-name">{devName}</h3>
                  <p className="dev-phone">
                    <Phone size={14} />
                    <span>{devPhone}</span>
                  </p>
                </div>
              </div>

              {/* WHATSAPP ACTION BUTTON */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-contact-btn"
              >
                <MessageCircle size={20} />
                <span>تواصل عبر الواتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* AZKAR & SUPPLICATIONS MAIN SECTION */}
      <main className="main-content-area max-w-7xl mx-auto">
        <div className="azkar-main-container">
          {/* Header & Subtabs */}
          <div className="azkar-header-bar">
            <div className="azkar-header-title-box">
              <div className="azkar-icon-wrapper">
                <Award size={24} />
              </div>
              <div>
                <h3 className="azkar-section-title">الأذكار والاستغفارات والأدعية الإسلامية</h3>
                <p className="azkar-section-subtitle">مجلوبة مباشرة من API حصن المسلم والمصادر المعتمدة</p>
              </div>
            </div>

            {/* Subtabs Buttons */}
            <div className="azkar-tabs-group">
              <button
                onClick={() => setActiveAzkarTab('tasbeeh')}
                className={`azkar-subtab-btn ${activeAzkarTab === 'tasbeeh' ? 'active' : ''}`}
              >
                <Sparkles size={16} />
                <span>عداد الاستغفار والسبحة</span>
              </button>

              <button
                onClick={() => {
                  setActiveAzkarTab('morning_evening');
                  setSelectedCatId(27);
                  setSelectedCatTitle('أذكار الصباح والمساء');
                }}
                className={`azkar-subtab-btn ${activeAzkarTab === 'morning_evening' ? 'active' : ''}`}
              >
                <Sun size={16} />
                <span>أذكار الصباح والمساء</span>
              </button>

              <button
                onClick={() => {
                  setActiveAzkarTab('supplications');
                  setSelectedCatId(28);
                  setSelectedCatTitle('الأدعية المأثورة من القرآن والسنة');
                }}
                className={`azkar-subtab-btn ${activeAzkarTab === 'supplications' ? 'active' : ''}`}
              >
                <BookOpen size={16} />
                <span>الأدعية المأثورة</span>
              </button>

              <button
                onClick={() => setActiveAzkarTab('all_categories')}
                className={`azkar-subtab-btn ${activeAzkarTab === 'all_categories' ? 'active' : ''}`}
              >
                <Search size={16} />
                <span>فهرس حصن المسلم ({categories.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: INTERACTIVE DIGITAL TASBEEH & ISTIGHFAR COUNTER */}
          {activeAzkarTab === 'tasbeeh' && (
            <div className="tasbeeh-layout-grid">
              {/* Selector List */}
              <div className="tasbeeh-selector-list">
                <h4 className="tasbeeh-section-heading">اختر الذكر أو الاستغفار للتسبيح:</h4>
                {DEFAULT_TASBEEH.map(item => {
                  const cnt = tasbeehCounts[item.id] || 0;
                  const isSelected = selectedTasbeeh.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTasbeeh(item)}
                      className={`tasbeeh-selector-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="tasbeeh-card-header">
                        <p className="tasbeeh-arabic-title">{item.text}</p>
                        <span className="tasbeeh-count-badge">
                          {cnt}
                        </span>
                      </div>
                      <p className="tasbeeh-reward-text">✨ {item.reward}</p>
                    </div>
                  );
                })}
              </div>

              {/* Digital Counter Console */}
              <div className="tasbeeh-digital-console">
                <span className="console-category-tag">
                  السبحة الإلكترونية والعداد الذكي
                </span>
                
                <h3 className="console-quote-text font-amiri">
                  "{selectedTasbeeh.text}"
                </h3>

                <p className="console-reward-subtitle">{selectedTasbeeh.reward}</p>

                {/* Big Counter Trigger Button */}
                <div className="console-button-area">
                  <button
                    onClick={() => handleIncrementTasbeeh(selectedTasbeeh.id)}
                    className="tasbeeh-big-btn"
                  >
                    <span className="tasbeeh-number font-outfit">
                      {currentCount}
                    </span>
                    <span className="tasbeeh-label">اضغط للتسبيح</span>
                  </button>
                </div>

                {/* Counter Control Buttons */}
                <div className="console-actions-bar">
                  <button
                    onClick={() => handleResetTasbeeh(selectedTasbeeh.id)}
                    className="tasbeeh-reset-btn"
                    title="تصفير العداد"
                  >
                    <RotateCcw size={16} />
                    <span>تصفير العداد</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 & 3: MORNING/EVENING & SUPPLICATIONS LIST FROM API */}
          {(activeAzkarTab === 'morning_evening' || activeAzkarTab === 'supplications') && (
            <div className="azkar-items-section">
              <div className="azkar-items-header">
                <h4 className="azkar-category-title">{selectedCatTitle}</h4>
                {loadingAzkar && (
                  <span className="loading-status-tag">
                    <Loader2 size={16} className="spin-icon" />
                    <span>جاري تحميل الأذكار من الـ API...</span>
                  </span>
                )}
              </div>

              {azkarItems.length === 0 && !loadingAzkar ? (
                <div className="empty-state">
                  <p>لا توجد أذكار متوفرة حالياً لهذه الفئة.</p>
                </div>
              ) : (
                <div className="azkar-card-grid">
                  {azkarItems.map((item, idx) => {
                    const maxCount = item.REPEAT || 1;
                    const doneCount = itemProgress[item.ID || idx] || 0;
                    const isCompleted = doneCount >= maxCount;

                    return (
                      <div
                        key={item.ID || idx}
                        className={`azkar-item-card ${isCompleted ? 'completed' : ''}`}
                      >
                        <p className="azkar-arabic-text font-amiri">
                          {item.ARABIC_TEXT}
                        </p>

                        <div className="azkar-card-footer">
                          <span className="azkar-repeat-label">
                            التكرار المطلوب: <strong className="font-outfit">{maxCount}</strong>
                          </span>

                          <button
                            onClick={() => handleItemCountClick(item.ID || idx, maxCount)}
                            disabled={isCompleted}
                            className={`azkar-digital-repeat-btn ${isCompleted ? 'completed' : ''}`}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 size={16} />
                                <span>تم القراءة ({doneCount}/{maxCount})</span>
                              </>
                            ) : (
                              <>
                                <span>اقرأ وكرر ({doneCount}/{maxCount})</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPLETE HISN MUSLIM CATALOG FROM API */}
          {activeAzkarTab === 'all_categories' && (
            <div className="hisn-catalog-section">
              <div className="search-bar-wrapper catalog-search">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="ابحث في كافة أذكار وأدعية حصن المسلم (مثال: السفر، النوم، الصلاة، الكرب)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="main-search-input"
                />
              </div>

              <div className="hisn-catalog-grid">
                {filteredCategories.map(cat => (
                  <button
                    key={cat.ID}
                    onClick={() => {
                      setSelectedCatId(cat.ID);
                      setSelectedCatTitle(cat.TITLE);
                      setActiveAzkarTab('morning_evening');
                    }}
                    className="hisn-category-btn"
                  >
                    <span className="hisn-cat-title">
                      {cat.TITLE}
                    </span>
                    <span className="hisn-cat-id font-outfit">#{cat.ID}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
