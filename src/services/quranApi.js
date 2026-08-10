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
 * أسماء ملفات مصحف الشيخ علاء عقل المرتل كاملاً
 */
const ALAA_AKL_FILENAMES = [
  "001 - الفاتحة.mp3","002 - البقرة.mp3","003 - آل عمران.mp3","004 - النساء.mp3","005 - المائدة.mp3","006 - الأنعام.mp3","007 - الأعراف.mp3","008 - الأنفال.mp3","009 - التوبة.mp3","010 - يونس.mp3","011 - هود.mp3","012 - يوسف.mp3","013 - الرعد.mp3","014 - إبراهيم.mp3","015 - الحجر.mp3","016 - النحل.mp3","017 - الإسراء.mp3","018 - الكهف.mp3","019 - مريم.mp3","020 - طه.mp3","021 - الأنبياء.mp3","022 - الحج.mp3","023 - المؤمنون.mp3","024 - النور.mp3","025 - الفرقان.mp3","026 - الشعراء.mp3","027 - النمل.mp3","028 - القصص.mp3","029 - العنكبوت.mp3","030 - الروم.mp3","031 - لقمان.mp3","032 - السجدة.mp3","033 - الأحزاب.mp3","034 - سبأ.mp3","035 - فاطر.mp3","036 - يس.mp3","037 - الصافات.mp3","038 - ص.mp3","039 - الزمر.mp3","040 - غافر.mp3","041 - فصلت.mp3","042 - الشورى.mp3","043 - الزخرف.mp3","044 - الدخان.mp3","045 - الجاثية.mp3","046 - الأحقاف.mp3","047 - محمد.mp3","048 - الفتح.mp3","049 - الحجرات.mp3","050 - ق.mp3","051 - الذاريات.mp3","052 - الطور.mp3","053 - النجم.mp3","054 - القمر.mp3","055 - الرحمن.mp3","056 - الواقعة.mp3","057 - الحديد.mp3","058 - المجادلة.mp3","059 - الحشر.mp3","060 - الممتحنة.mp3","061 - الصف.mp3","062 - الجمعة.mp3","063 - المنافقون.mp3","064 - التغابن.mp3","065 - الطلاق.mp3","066 - التحريم.mp3","067 - الملك.mp3","068 - القلم.mp3","069 - الحاقة.mp3","070 - المعارج.mp3","071 - نوح.mp3","072 - الجن.mp3","073 - المزمل.mp3","074 - المدثر.mp3","075 - القيامة.mp3","076 - الإنسان.mp3","077 - المرسلات.mp3","078 - النبأ.mp3","079 - النازعات.mp3","080 - عبس.mp3","081 - التكوير.mp3","082 - الانفطار.mp3","083 - المطففين.mp3","084 - الانشقاق.mp3","085 - البروج.mp3","086 - الطارق.mp3","087 - الأعلى.mp3","088 - الغاشية.mp3","089 - الفجر.mp3","090 - البلد.mp3","091 - الشمس.mp3","092 - الليل.mp3","093 - الضحى.mp3","094 - الشرح.mp3","095 - التين.mp3","096 - العلق.mp3","097 - القدر.mp3","098 - البينة.mp3","099 - الززلزلة.mp3","100 - العاديات.mp3","101 - القارعة.mp3","102 - التكاثر.mp3","103 - العصر.mp3","104 - الهمزة.mp3","105 - الفيل.mp3","106 - قريش.mp3","107 - الماعون.mp3","108 - الكوثر.mp3","109 - الكافرون.mp3","110 - النصر.mp3","111 - المسد.mp3","112 - الإخلاص.mp3","113 - الفلق.mp3","114 - الناس.mp3"
];

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
 * كائن بيانات الشيخ علاء عقل المدمج يدوياً
 */
const ALAA_AKL_RECITER = {
  id: 8888,
  name: "علاء عقل",
  letter: "ع",
  moshaf: [
    {
      id: 8888,
      name: "حفص عن عاصم - المصحف المرتل كاملاً",
      rewaya_id: 1,
      server: "ALAA_AKL_ARCHIVE",
      surah_total: 114,
      moshaf_type: 1,
      surah_list: Array.from({length: 114}, (_, i) => i + 1).join(','),
      availableSurahs: Array.from({length: 114}, (_, i) => i + 1)
    }
  ],
  defaultAvatar: {
    color: "linear-gradient(135deg, #14B8A6, #0EA5E9)",
    initial: "ع"
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
 * جلب قائمة القراء مع المصاحف المتوفرة لكل قارئ (ودمج الشيخ شعيشع والشيخ علاء عقل)
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

  // دمج القراء الإضافيين دائماً إذا لم يكونوا موجودين
  if (Array.isArray(recitersList)) {
    if (!recitersList.some(r => r.id === 9999)) {
      recitersList = [SHUAISHA_RECITER, ...recitersList];
    }
    if (!recitersList.some(r => r.id === 8888)) {
      recitersList = [ALAA_AKL_RECITER, ...recitersList];
    }
  }

  return recitersList;
}

/**
 * بناء رابط ملف الـ MP3 بشكل آمن ودقيق بناءً على السيرفر ورقم السورة
 */
export function buildAudioUrl(serverUrl, surahId) {
  if (!serverUrl || !surahId) return '';
  
  // اعتراض طلبات الشيخ أبو العينين شعيشع وتوجيهها لأرشيف الإنترنت
  if (serverUrl === 'SHUAISHA_ARCHIVE') {
    const filename = SHUAISHA_SURAH_MAP[surahId];
    if (!filename) return '';
    return `https://archive.org/download/way2sona_20160508_2209/${filename}`;
  }

  // اعتراض طلبات الشيخ علاء عقل وتوجيهها لأرشيف الإنترنت
  if (serverUrl === 'ALAA_AKL_ARCHIVE') {
    const filename = ALAA_AKL_FILENAMES[surahId - 1];
    if (!filename) return '';
    return `https://archive.org/download/a015aaaaaaaaaaaaas/${encodeURIComponent(filename)}`;
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
