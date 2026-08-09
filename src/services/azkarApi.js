const HISN_BASE_URL = 'https://hisnmuslim.com/api/ar';

const CACHE_KEYS = {
  AZKAR_CATEGORIES: 'quran_azkar_categories_v1',
  AZKAR_ITEMS_PREFIX: 'quran_azkar_items_'
};

/**
 * جلب تصنيفات الأذكار من API حصن المسلم
 */
export async function getAzkarCategories() {
  try {
    const cached = localStorage.getItem(CACHE_KEYS.AZKAR_CATEGORIES);
    if (cached) {
      return JSON.parse(cached);
    }

    const response = await fetch(`${HISN_BASE_URL}/husn_ar.json`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const categories = data['العربية'] || [];

    if (categories.length > 0) {
      localStorage.setItem(CACHE_KEYS.AZKAR_CATEGORIES, JSON.stringify(categories));
    }

    return categories;
  } catch (error) {
    console.error('Error fetching Azkar categories:', error);
    const cached = localStorage.getItem(CACHE_KEYS.AZKAR_CATEGORIES);
    if (cached) return JSON.parse(cached);
    return [];
  }
}

/**
 * جلب تفاصيل وتلاوات أذكار تصنيف معين عبر معرف التصنيف
 */
export async function getAzkarItems(categoryId) {
  if (!categoryId) return [];
  const cacheKey = `${CACHE_KEYS.AZKAR_ITEMS_PREFIX}${categoryId}`;
  
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const response = await fetch(`${HISN_BASE_URL}/${categoryId}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const keys = Object.keys(data);
    const items = keys.length > 0 ? data[keys[0]] : [];

    if (items.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify(items));
    }

    return items;
  } catch (error) {
    console.error(`Error fetching Azkar category ${categoryId}:`, error);
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
    return [];
  }
}

/**
 * قائمة الأستغفارات والتسابيح الشائعة للعداد التفاعلي
 */
export const DEFAULT_TASBEEH = [
  { id: 1, text: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ', reward: 'تكفير الذنوب وتوسيع الرزق', target: 33 },
  { id: 2, text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ', reward: 'خفيفتان على اللسان ثقيلتان في الميزان', target: 33 },
  { id: 3, text: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', reward: 'عتق عشر رقاب وتكتب له مائة حسنة', target: 10 },
  { id: 4, text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى نَبِيِّنَا مُحَمَّدٍ', reward: 'من صلى عليّ صلاة صلى الله عليه بها عشراً', target: 10 },
  { id: 5, text: 'لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ', reward: 'كنز من كنوز الجنة', target: 33 },
  { id: 6, text: 'سُبْحَانَ اللَّهِ ، وَالْحَمْدُ لِلَّهِ ، وَلاَ إِلَهَ إِلاَّ اللَّهُ ، وَاللَّهُ أَكْبَرُ', reward: 'أحب الكلام إلى الله', target: 33 }
];
