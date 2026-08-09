const BASE_URL = 'https://www.mp3quran.net/api/v3';

const CACHE_KEYS = {
  SUWAR: 'quran_suwar_cache_v1',
  RECITERS: 'quran_reciters_cache_v1'
};

/**
 * جلب قائمة السور مع التخزين المؤقت
 */
export async function getSuwar() {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.SUWAR);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    const response = await fetch(`${BASE_URL}/suwar?language=ar`);
    if (!response.ok) {
      throw new Error(`فشل جلب بيانات السور: HTTP status ${response.status}`);
    }

    const data = await response.json();
    const suwarList = data.suwar || [];

    // تطبيع البيانات وخزنها
    if (suwarList.length > 0) {
      localStorage.setItem(CACHE_KEYS.SUWAR, JSON.stringify(suwarList));
    }

    return suwarList;
  } catch (error) {
    console.error('Error fetching suwar:', error);
    // محاولة الإرجاع من الكاش إذا وجد حتى لو انتهى
    const cached = localStorage.getItem(CACHE_KEYS.SUWAR);
    if (cached) return JSON.parse(cached);
    throw error;
  }
}

/**
 * جلب قائمة القراء مع المصاحف المتوفرة لكل قارئ
 */
export async function getReciters() {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.RECITERS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    const response = await fetch(`${BASE_URL}/reciters?language=ar`);
    if (!response.ok) {
      throw new Error(`فشل جلب بيانات القراء: HTTP status ${response.status}`);
    }

    const data = await response.json();
    const recitersList = (data.reciters || []).map(reciter => {
      // تطبيع ومعالجة قائمة السور لكل مصحف إلى مصفوفة أرقام
      const normalizedMoshaf = (reciter.moshaf || []).map(m => {
        const surahArray = m.surah_list
          ? m.surah_list.split(',').map(num => parseInt(num.trim(), 10)).filter(Boolean)
          : [];
        return {
          ...m,
          availableSurahs: surahArray
        };
      });

      return {
        ...reciter,
        moshaf: normalizedMoshaf,
        // صورة افتراضية ملائمة مستوحاة من الهوية العربية الإسلامية الأنيقة
        defaultAvatar: getAvatarForReciter(reciter.id, reciter.name)
      };
    });

    if (recitersList.length > 0) {
      localStorage.setItem(CACHE_KEYS.RECITERS, JSON.stringify(recitersList));
    }

    return recitersList;
  } catch (error) {
    console.error('Error fetching reciters:', error);
    const cached = localStorage.getItem(CACHE_KEYS.RECITERS);
    if (cached) return JSON.parse(cached);
    throw error;
  }
}

/**
 * بناء رابط ملف الـ MP3 بشكل آمن ودقيق بناءً على السيرفر ورقم السورة
 */
export function buildAudioUrl(serverUrl, surahId) {
  if (!serverUrl || !surahId) return '';
  // ضمان وجود السلاش في نهاية الرابط قبل إضافة رقم السورة
  const cleanServer = serverUrl.endsWith('/') ? serverUrl : `${serverUrl}/`;
  const paddedId = surahId.toString().padStart(3, '0');
  return `${cleanServer}${paddedId}.mp3`;
}

/**
 * توليد أيقونة/رمز ملون افتراضي للقارئ يعتمد على اسمه ومعرفه
 */
function getAvatarForReciter(id, name) {
  const gradients = [
    'linear-gradient(135deg, #10B981, #047857)',
    'linear-gradient(135deg, #D4AF37, #85581A)',
    'linear-gradient(135deg, #0EA5E9, #0369A1)',
    'linear-gradient(135deg, #8B5CF6, #5B21B6)',
    'linear-gradient(135deg, #F59E0B, #B45309)',
    'linear-gradient(135deg, #14B8A6, #0F766E)'
  ];
  const color = gradients[id % gradients.length];
  const initial = name ? name.trim().charAt(0) : 'ق';
  return { color, initial };
}
