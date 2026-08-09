import React, { useState } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  RotateCcw, RotateCw, Maximize2, Minimize2, ChevronDown, 
  AlertTriangle, RefreshCw, Layers, Sparkles
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { DownloadButton } from './DownloadButton';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayer() {
  const {
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
    togglePlayPause,
    seek,
    changeVolume,
    toggleMute,
    handleNextSurah,
    handlePrevSurah,
    changeMoshaf
  } = useAudio();

  if (!currentSurah || !currentReciter) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* FULLSCREEN MOBILE & DESKTOP OVERLAY PLAYER (When Expanded) */}
      {isExpanded && (
        <div className="mobile-player-overlay" onClick={() => setIsExpanded(false)}>
          <div className="mobile-player-card" onClick={(e) => e.stopPropagation()}>
            {/* Header / Dismiss */}
            <div className="mobile-player-header">
              <button 
                onClick={() => setIsExpanded(false)} 
                className="mobile-close-btn"
                title="تصغير المشغل"
              >
                <ChevronDown size={28} />
              </button>
              <div className="text-center">
                <span className="text-xs font-semibold text-amber-500 flex items-center justify-center gap-1">
                  <Sparkles size={12} />
                  <span>مشغل القرآن الكريم</span>
                </span>
                <h4 className="text-sm font-bold opacity-80">جاري الاستماع الآن</h4>
              </div>
              <DownloadButton 
                surah={currentSurah} 
                reciter={currentReciter} 
                moshaf={currentMoshaf} 
                className="mobile-header-download"
              />
            </div>

            {/* Artwork / Avatar Display */}
            <div className="mobile-artwork-container">
              <div 
                className={`mobile-avatar-big ${isPlaying ? 'pulse-glow' : ''}`}
                style={{ background: currentReciter.defaultAvatar?.color }}
              >
                <span>{currentReciter.defaultAvatar?.initial || 'ق'}</span>
              </div>
            </div>

            {/* Title & Reciter Info */}
            <div className="mobile-track-info text-center">
              <h2 className="mobile-surah-name">{currentSurah.name}</h2>
              <p className="mobile-reciter-name">{currentReciter.name}</p>
              {currentMoshaf && (
                <div className="mobile-moshaf-badge">
                  <Layers size={13} />
                  <span>{currentMoshaf.name}</span>
                </div>
              )}
            </div>

            {/* Timeline & Progress Bar */}
            <div className="mobile-timeline-wrapper">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="timeline-range mobile-range"
                style={{
                  background: `linear-gradient(to left, var(--accent-gold) ${progressPercent}%, var(--border-color) ${progressPercent}%)`
                }}
              />
              <div className="flex justify-between text-xs font-outfit text-muted mt-1 px-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Playback Controls */}
            <div className="mobile-main-controls">
              <button
                onClick={() => setAutoNext(!autoNext)}
                className={`control-icon-btn ${autoNext ? 'active' : ''}`}
                title="التشغيل التلقائي تالياً"
              >
                <RefreshCw size={20} className={autoNext ? 'rotate-animation' : ''} />
              </button>

              <button onClick={handlePrevSurah} className="control-icon-btn nav-skip">
                <SkipForward size={24} />
              </button>

              <button
                onClick={togglePlayPause}
                disabled={isLoading}
                className="mobile-play-main-btn"
                aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isLoading ? (
                  <div className="player-spinner" />
                ) : isPlaying ? (
                  <Pause size={28} />
                ) : (
                  <Play size={28} className="mr-0.5" />
                )}
              </button>

              <button onClick={handleNextSurah} className="control-icon-btn nav-skip">
                <SkipBack size={24} />
              </button>

              <div className="speed-dropdown-wrapper">
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="speed-select"
                >
                  <option value="0.75">0.75x</option>
                  <option value="1">1.0x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2.0x</option>
                </select>
              </div>
            </div>

            {/* Volume Control */}
            <div className="mobile-volume-bar">
              <button onClick={toggleMute} className="volume-btn">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="volume-range flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* PERSISTENT STICKY BAR (Desktop + Compact Mobile Bottom Bar) */}
      <div className="audio-player-wrapper">
        {audioError && (
          <div className="audio-error-banner">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{audioError}</span>
          </div>
        )}

        <div className="audio-player-container">
          {/* Info Section (Tapping expands on mobile) */}
          <div 
            className="player-info-section cursor-pointer" 
            onClick={() => setIsExpanded(true)}
          >
            <div className="player-avatar shrink-0" style={{ background: currentReciter.defaultAvatar?.color }}>
              {currentReciter.defaultAvatar?.initial || 'ق'}
            </div>

            <div className="player-titles">
              <div className="flex items-center gap-2">
                <span className="surah-name-display">{currentSurah.name}</span>
                <span className="surah-badge">سورة {currentSurah.id}</span>
              </div>
              <div className="reciter-name-display">
                <span>{currentReciter.name}</span>
                {currentMoshaf && (
                  <span className="moshaf-tag font-medium">({currentMoshaf.name})</span>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Center Controls (Hidden or compact on small mobile) */}
          <div className="player-center-controls desktop-only-controls">
            <div className="control-buttons">
              <button
                onClick={() => setAutoNext(!autoNext)}
                className={`control-icon-btn ${autoNext ? 'active' : ''}`}
                title={autoNext ? 'التشغيل التلقائي تالياً: مفعل' : 'التشغيل التلقائي تالياً: معطل'}
              >
                <RefreshCw size={16} className={autoNext ? 'rotate-animation' : ''} />
              </button>

              <button
                onClick={() => seek(Math.max(0, currentTime - 10))}
                className="control-icon-btn"
                title="إعادة 10 ثوانٍ"
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={handlePrevSurah}
                className="control-icon-btn nav-skip"
                title="السورة السابقة"
              >
                <SkipForward size={20} />
              </button>

              <button
                onClick={togglePlayPause}
                disabled={isLoading}
                className="play-pause-main-btn"
                aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isLoading ? (
                  <div className="player-spinner" />
                ) : isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} className="mr-0.5" />
                )}
              </button>

              <button
                onClick={handleNextSurah}
                className="control-icon-btn nav-skip"
                title="السورة التالية"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={() => seek(Math.min(duration, currentTime + 10))}
                className="control-icon-btn"
                title="تقديم 10 ثوانٍ"
              >
                <RotateCw size={18} />
              </button>

              <div className="speed-dropdown-wrapper">
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="speed-select"
                >
                  <option value="0.75">0.75x</option>
                  <option value="1">1.0x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2.0x</option>
                </select>
              </div>
            </div>

            <div className="progress-timeline">
              <span className="time-display">{formatTime(currentTime)}</span>
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="timeline-range"
                  style={{
                    background: `linear-gradient(to left, var(--accent-gold) ${progressPercent}%, var(--border-color) ${progressPercent}%)`
                  }}
                />
              </div>
              <span className="time-display">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Options & Mobile Quick Buttons */}
          <div className="player-right-options">
            {/* Moshaf Rewaya Selector */}
            {currentReciter.moshaf && currentReciter.moshaf.length > 1 && (
              <div className="moshaf-select-wrapper desktop-only">
                <Layers size={16} className="text-muted shrink-0" />
                <select
                  value={currentMoshaf?.id}
                  onChange={(e) => {
                    const selected = currentReciter.moshaf.find(m => m.id === parseInt(e.target.value, 10));
                    if (selected) changeMoshaf(selected);
                  }}
                  className="moshaf-select"
                >
                  {currentReciter.moshaf.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Desktop Volume */}
            <div className="volume-control desktop-only">
              <button onClick={toggleMute} className="volume-btn">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="volume-range"
              />
            </div>

            {/* Download Button */}
            <DownloadButton 
              surah={currentSurah} 
              reciter={currentReciter} 
              moshaf={currentMoshaf} 
              className="player-download-btn desktop-only"
            />

            {/* Mobile Compact Play/Pause Quick Control */}
            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              className="mobile-quick-play-btn"
            >
              {isLoading ? <div className="player-spinner" /> : isPlaying ? <Pause size={20} /> : <Play size={20} className="mr-0.5" />}
            </button>

            {/* Mobile Expand Modal Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="expand-player-btn"
              title="توسيع المشغل"
            >
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
