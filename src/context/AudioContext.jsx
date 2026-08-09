import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { buildAudioUrl } from '../services/quranApi';

const AudioContext = createContext();

export function AudioProvider({ children, suwarList, recitersList }) {
  const audioRef = useRef(new Audio());

  const [currentSurah, setCurrentSurah] = useState(null);
  const [currentReciter, setCurrentReciter] = useState(null);
  const [currentMoshaf, setCurrentMoshaf] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [autoNext, setAutoNext] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  // إعداد أحداث عنصر الصوت
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };
    const handleCanPlay = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setAudioError(null);
    };
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      setIsPlaying(false);
      if (autoNext) {
        handleNextSurah();
      }
    };

    const handleError = (e) => {
      console.error('Audio playback error:', e);
      setIsLoading(false);
      setIsPlaying(false);
      setAudioError('تعذر تحميل الملف الصوتي من السيرفر. قد يكون السيرفر مشغولاً أو الملف غير متوفر حالياً.');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [autoNext, currentSurah, currentReciter, currentMoshaf, suwarList]);

  // تحديث سرعة التشغيل ومستوى الصوت
  useEffect(() => {
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const playSurah = (surah, reciter, moshaf) => {
    const targetReciter = reciter || currentReciter || (recitersList && recitersList[0]);
    if (!targetReciter) return;

    const targetMoshaf = moshaf || (targetReciter.moshaf && targetReciter.moshaf[0]);
    if (!targetMoshaf) return;

    const audioUrl = buildAudioUrl(targetMoshaf.server, surah.id);
    if (!audioUrl) return;

    setAudioError(null);
    setIsLoading(true);
    setCurrentSurah(surah);
    setCurrentReciter(targetReciter);
    setCurrentMoshaf(targetMoshaf);

    const audio = audioRef.current;
    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
    }

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(err => {
      console.error('Play request interrupted:', err);
    });
  };

  const togglePlayPause = () => {
    if (!currentSurah) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.error('Play error:', err));
    }
  };

  const seek = (timeInSeconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = timeInSeconds;
    setCurrentTime(timeInSeconds);
  };

  const changeVolume = (newVolume) => {
    const val = Math.max(0, Math.min(1, newVolume));
    setVolumeState(val);
    audioRef.current.volume = val;
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume > 0 ? volume : 0.8;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleNextSurah = () => {
    if (!currentSurah || !currentMoshaf || !suwarList) return;
    const availableIds = currentMoshaf.availableSurahs || [];
    if (availableIds.length === 0) return;

    const currentIndex = availableIds.indexOf(currentSurah.id);
    if (currentIndex !== -1 && currentIndex < availableIds.length - 1) {
      const nextSurahId = availableIds[currentIndex + 1];
      const nextSurah = suwarList.find(s => s.id === nextSurahId);
      if (nextSurah) {
        playSurah(nextSurah, currentReciter, currentMoshaf);
      }
    }
  };

  const handlePrevSurah = () => {
    if (!currentSurah || !currentMoshaf || !suwarList) return;
    const availableIds = currentMoshaf.availableSurahs || [];
    if (availableIds.length === 0) return;

    const currentIndex = availableIds.indexOf(currentSurah.id);
    if (currentIndex > 0) {
      const prevSurahId = availableIds[currentIndex - 1];
      const prevSurah = suwarList.find(s => s.id === prevSurahId);
      if (prevSurah) {
        playSurah(prevSurah, currentReciter, currentMoshaf);
      }
    }
  };

  const changeMoshaf = (newMoshaf) => {
    setCurrentMoshaf(newMoshaf);
    if (currentSurah) {
      // تحقق هل السورة الحالية متاحة في المصحف الجديد
      const isAvailable = (newMoshaf.availableSurahs || []).includes(currentSurah.id);
      if (isAvailable) {
        playSurah(currentSurah, currentReciter, newMoshaf);
      } else {
        // اختر أول سورة متاحة في هذا المصحف
        const firstSurahId = newMoshaf.availableSurahs[0];
        const firstSurah = suwarList.find(s => s.id === firstSurahId);
        if (firstSurah) {
          playSurah(firstSurah, currentReciter, newMoshaf);
        }
      }
    }
  };

  return (
    <AudioContext.Provider value={{
      currentSurah,
      currentReciter,
      currentMoshaf,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      volume,
      isMuted,
      audioError,
      autoNext,
      playbackSpeed,
      isExpanded,
      setIsExpanded,
      setAutoNext,
      setPlaybackSpeed,
      playSurah,
      togglePlayPause,
      seek,
      changeVolume,
      toggleMute,
      handleNextSurah,
      handlePrevSurah,
      changeMoshaf
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
