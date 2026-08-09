import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AudioProvider } from './context/AudioContext';
import { getSuwar, getReciters } from './services/quranApi';

import { Navbar } from './components/Navbar';
import { AudioPlayer } from './components/AudioPlayer';
import { SurahsView } from './views/SurahsView';
import { RecitersView } from './views/RecitersView';
import { FavoritesView } from './views/FavoritesView';
import { GiftView } from './views/GiftView';
import { ReciterDetailModal } from './views/ReciterDetailModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

function AppContent() {
  const [suwarList, setSuwarList] = useState([]);
  const [recitersList, setRecitersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('surahs'); // 'surahs' | 'reciters' | 'favorites' | 'gift'
  const [modalReciter, setModalReciter] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [suwarData, recitersData] = await Promise.all([
        getSuwar(),
        getReciters()
      ]);
      setSuwarList(suwarData);
      setRecitersList(recitersData);
    } catch (err) {
      console.error('Error initializing Quran platform data:', err);
      setError('تعذر اتخاذ الاتصال بسيرفر mp3quran.net. يرجى التحقق من الاتصال بالشبكة وإعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader-spinner" />
        <h3 className="font-amiri text-2xl font-bold">منصة القرآن الكريم</h3>
        <p className="text-muted text-sm">جارٍ تحميل السور والقراء من سيرفر mp3quran...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <AlertCircle size={48} className="text-rose-500 mb-2" />
        <h3 className="text-xl font-bold text-rose-500">حدث خطأ في جلب البيانات</h3>
        <p className="text-muted max-w-md text-center text-sm">{error}</p>
        <button onClick={loadData} className="primary-action-btn mt-4">
          <RefreshCw size={18} />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  return (
    <AudioProvider suwarList={suwarList} recitersList={recitersList}>
      <div className="app-container">
        {/* Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* View Switcher */}
        {activeTab === 'surahs' && (
          <SurahsView
            suwarList={suwarList}
            recitersList={recitersList}
            onOpenReciterModal={(reciter) => setModalReciter(reciter)}
          />
        )}

        {activeTab === 'reciters' && (
          <RecitersView
            recitersList={recitersList}
            onSelectReciter={(reciter) => setModalReciter(reciter)}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            suwarList={suwarList}
            recitersList={recitersList}
            onSelectReciter={(reciter) => setModalReciter(reciter)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'gift' && <GiftView />}

        {/* Reciter Detail Modal */}
        {modalReciter && (
          <ReciterDetailModal
            reciter={modalReciter}
            suwarList={suwarList}
            onClose={() => setModalReciter(null)}
          />
        )}

        {/* Sticky Audio Player */}
        <AudioPlayer />
      </div>
    </AudioProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </ThemeProvider>
  );
}
