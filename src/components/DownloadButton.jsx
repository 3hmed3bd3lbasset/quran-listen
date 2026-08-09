import React, { useState } from 'react';
import { Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { buildAudioUrl } from '../services/quranApi';

export function DownloadButton({ surah, reciter, moshaf, className = '' }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'downloading' | 'success' | 'error'
  const [progress, setProgress] = useState(0);

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!surah || !moshaf || !moshaf.server) {
      setStatus('error');
      return;
    }

    const audioUrl = buildAudioUrl(moshaf.server, surah.id);
    if (!audioUrl) return;

    setStatus('downloading');
    setProgress(0);

    try {
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error('فشل جلب الملف من السيرفر');
      }

      const contentLength = response.headers.get('content-length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
      
      const reader = response.body.getReader();
      let receivedBytes = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedBytes += value.length;

        if (totalBytes > 0) {
          const pct = Math.round((receivedBytes / totalBytes) * 100);
          setProgress(pct);
        }
      }

      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);

      // تنزيل الملف مع اسم منسق ونظيف
      const paddedId = surah.id.toString().padStart(3, '0');
      const reciterName = reciter ? reciter.name.replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, '') : 'القارئ';
      const fileName = `${paddedId}_${surah.name}_${reciterName}.mp3`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Download error:', error);
      // في حالة وجود أي كتم أو قيود شبكة، افتح رابط التحميل المباشر في تبويب جديد
      window.open(audioUrl, '_blank');
      setStatus('idle');
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status === 'downloading'}
      className={`download-btn ${status} ${className}`}
      title={
        status === 'downloading'
          ? `جارٍ التحميل ${progress}%`
          : status === 'success'
          ? 'تم التحميل بنجاح'
          : status === 'error'
          ? 'خطأ في التحميل'
          : 'تحميل تلاوة هذه السورة'
      }
      aria-label="تحميل السورة"
    >
      {status === 'idle' && <Download size={18} />}
      {status === 'downloading' && (
        <span className="flex items-center gap-1">
          <Loader2 size={16} className="spin-icon" />
          <span className="text-xs font-outfit">{progress}%</span>
        </span>
      )}
      {status === 'success' && <CheckCircle size={18} className="text-emerald-500" />}
      {status === 'error' && <AlertCircle size={18} className="text-rose-500" />}
    </button>
  );
}
