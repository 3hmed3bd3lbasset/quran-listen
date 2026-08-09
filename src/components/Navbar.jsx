import React from 'react';
import { BookOpen, Users, Bookmark, Sun, Moon, Sparkles, Gift } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';

export function Navbar({ activeTab, setActiveTab }) {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  const totalFavs = (favorites.surahs?.length || 0) + (favorites.reciters?.length || 0);

  return (
    <header className="navbar-container">
      <div className="navbar-content max-w-7xl mx-auto">
        {/* Brand / Logo */}
        <div className="brand-logo" onClick={() => setActiveTab('surahs')}>
          <div className="logo-icon-wrapper">
            <Sparkles className="logo-sparkle" size={16} />
            <BookOpen className="logo-book" size={24} />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">القرآن الكريم</h1>
            <span className="brand-subtitle">المنصة الصوتية المتكاملة</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button
            onClick={() => setActiveTab('surahs')}
            className={`nav-tab-btn ${activeTab === 'surahs' ? 'active' : ''}`}
          >
            <BookOpen size={18} />
            <span>السور</span>
          </button>

          <button
            onClick={() => setActiveTab('reciters')}
            className={`nav-tab-btn ${activeTab === 'reciters' ? 'active' : ''}`}
          >
            <Users size={18} />
            <span>القراء</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`nav-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          >
            <Bookmark size={18} />
            <span>المفضلة</span>
            {totalFavs > 0 && <span className="fav-badge">{totalFavs}</span>}
          </button>

          <button
            onClick={() => setActiveTab('gift')}
            className={`nav-tab-btn gift-tab-highlight ${activeTab === 'gift' ? 'active' : ''}`}
          >
            <Gift size={18} className="text-amber-500" />
            <span>هدية</span>
          </button>
        </nav>

        {/* Actions (Theme Toggle) */}
        <div className="nav-actions">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الداكن'}
            aria-label="تبديل وضع المظهر"
          >
            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}
