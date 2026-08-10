const BASE_URL = 'https://www.mp3quran.net/api/v3';

const CACHE_KEYS = {
  SUWAR: 'quran_suwar_cache_v1',
  RECITERS: 'quran_reciters_cache_v1'
};

/**
 * خريطة سور الشيخ أبو العينين شعيشع المتاحة في أرشيف الإنترنت
 */
const SHUAISHA_SURAH_MAP = {
  1: "_Dhuha_to_Nas.mp3",
  2: "_Baqarah-3.mp3",
  3: "_Al_Imran.mp3",
  4: "_Nesaa.mp3",
  5: "_Al_Maedah.mp3",
  6: "_Al-An3am.mp3",
  7: "_Al-A3raf.mp3",
  8: "_Al-Anfal_Al-Tawbah.mp3",
  9: "_Al-Tawbah.mp3",
  10: "_Al-Tawbah-Younus.mp3",
  11: "_Hood.mp3",
  12: "_Yousuf.mp3",
  13: "_Yousuf-Raad.mp3",
  14: "_Ibraheem_Hijr‫‬.mp3",
  15: "_Hijr_Nahl.mp3",
  16: "_Nahl.mp3",
  17: "_Nahl_Israa.mp3",
  18: "_Al_Kahf.mp3",
  19: "_Al_Kahf_Maryam.mp3",
  20: "_Taha.mp3",
  21: "_Taha_Anbiyaa.mp3",
  22: "_Anbyaa-Hajj.mp3",
  23: "_Hajj-Mo_menoon.mp3",
  24: "_Noor.mp3",
  25: "_Noor-Furqan.mp3",
  26: "_Shouaraa.mp3",
  27: "_Shouaraa-Naml.mp3",
  28: "_Naml-Qassas.mp3",
  29: "_Qassas-3ankaboot.mp3",
  30: "_Room_Luqman.mp3",
  31: "_Room_Luqman.mp3",
  33: "_Ahzab.mp3",
  34: "_Sad_Zumar.mp3",
  35: "_Fater_Yaseen.mp3",
  36: "_Yaseen_Saffat.mp3",
  37: "_Saffat_Sad.mp3",
  38: "_Sad_Zumar.mp3",
  39: "_Zumar_Ghafer.mp3",
  40: "_Zumar_Ghafer.mp3",
  41: "_Ghafer_Fussylat.mp3",
  42: "_Fussylat_Shoora.mp3",
  43: "_Shoora_Zukhruf.mp3",
  44: "_Zukhruf_Dukhan_Jathyah.mp3",
  45: "_Zukhruf_Dukhan_Jathyah.mp3",
  46: "_Jathyah_to_Muhammad.mp3",
  47: "_Jathyah_to_Muhammad.mp3",
  48: "_Jathyah_to_Muhammad.mp3",
  50: "_Tharyat_to_Qamar.mp3",
  54: "_Qamar_to_Waqyaah.mp3",
  55: "_Qamar_to_Waqyaah.mp3",
  56: "_Waqyaah_to_Mujadalah.mp3",
  58: "_Waqyaah_to_Mujadalah.mp3",
  60: "_Mujadalah_to_Mumtahanah.mp3",
  63: "_Nooh_to_Muddathyer.mp3",
  67: "_Qalam_to_Nooh.mp3",
  71: "_Nooh_to_Muddathyer.mp3",
  75: "_Qiyamah_to_Nabaa.mp3",
  78: "_Nazy3at_to_Inshyqaq.mp3",
  79: "_Nazy3at_to_Inshyqaq.mp3",
  81: "_Nazy3at_to_Inshyqaq.mp3",
  82: "_Nazy3at_to_Inshyqaq.mp3",
  83: "_Nazy3at_to_Inshyqaq.mp3",
  84: "_Nazy3at_to_Inshyqaq.mp3",
  93: "_Dhuha_to_Nas.mp3",
  114: "_Dhuha_to_Nas.mp3"
};

/**
 * كائن بيانات الشيخ أبو العينين شعيشع المدمج يدوياً
 */
const SHUAISHA_RECITER = {
  id: 9999,
  name: "أبو العينين شعيشع",
  letter: "أ",
  moshaf: [
    {
      id: 9999,
      name: "حفص عن عاصم - تسجيلات إذاعية نادرة",
      rewaya_id: 1,
      server: "SHUAISHA_ARCHIVE",
      surah_total: Object.keys(SHUAISHA_SURAH_MAP).length,
      moshaf_type: 1,
      surah_list: Object.keys(SHUAISHA_SURAH_MAP).join(','),
      availableSurahs: Object.keys(SHUAISHA_SURAH_MAP).map(Number)
    }
  ],
  defaultAvatar: {
    color: "linear-gradient(135deg, #85581A, #D4AF37)",
    initial: "أ"
  }
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

    if (suwarList.length > 0) {
      localStorage.setItem(CACHE_KEYS.SUWAR, JSON.stringify(suwarList));
    }

    return suwarList;
  } catch (error) {
    console.error('Error fetching suwar:', error);
    const cached = localStorage.getItem(CACHE_KEYS.SUWAR);
    if (cached) return JSON.parse(cached);
    throw error;
  }
}

/**
 * جلب قائمة القراء مع المصاحف المتوفرة لكل قارئ (ودمج الشيخ شعيشع تلقائياً)
 */
export async function getReciters() {
  let recitersList = [];
  try {
    const cached = localStorage.getItem(CACHE_KEYS.RECITERS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        recitersList = parsed;
      }
    }

    if (recitersList.length === 0) {
      const response = await fetch(`${BASE_URL}/reciters?language=ar`);
      if (!response.ok) {
        throw new Error(`فشل جلب بيانات القراء: HTTP status ${response.status}`);
      }

      const data = await response.json();
      recitersList = (data.reciters || []).map(reciter => {
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
          defaultAvatar: getAvatarForReciter(reciter.id, reciter.name)
        };
      });

      if (recitersList.length > 0) {
        localStorage.setItem(CACHE_KEYS.RECITERS, JSON.stringify(recitersList));
      }
    }
  } catch (error) {
    console.error('Error fetching reciters:', error);
    const cached = localStorage.getItem(CACHE_KEYS.RECITERS);
    if (cached) {
      recitersList = JSON.parse(cached);
    }
  }

  // دمج الشيخ شعيشع في قائمة القراء دائماً إذا لم يكن موجوداً
  if (Array.isArray(recitersList) && !recitersList.some(r => r.id === 9999)) {
    recitersList = [SHUAISHA_RECITER, ...recitersList];
  }

  return recitersList;
}

/**
 * بناء رابط ملف الـ MP3 بشكل آمن ودقيق بناءً على السيرفر ورقم السورة
 */
export function buildAudioUrl(serverUrl, surahId) {
  if (!serverUrl || !surahId) return '';
  
  // اعتراض طلبات الشيخ أبو العينين شعيشع وتوجيهها لأرشيف الإنترنت مباشرة
  if (serverUrl === 'SHUAISHA_ARCHIVE') {
    const filename = SHUAISHA_SURAH_MAP[surahId];
    if (!filename) return '';
    return `https://archive.org/download/way2sona_20160508_2209/${filename}`;
  }

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
