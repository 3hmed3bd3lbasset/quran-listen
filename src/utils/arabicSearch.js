/**
 * تطبيع النص العربي للبحث الفعال دون التأثر بالتشكيل والألفات والتاء المربوطة
 */
export function normalizeArabic(text) {
  if (!text) return '';
  
  return text
    .toString()
    .trim()
    .toLowerCase()
    // إزالة التشكيل والتنوين والشدة
    .replace(/[\u064B-\u0652\u0640]/g, '')
    // توحيد الألف بأشكالها (أ، إ، آ -> ا)
    .replace(/[أإآ]/g, 'ا')
    // توحيد التاء المربوطة والهاء في نهاية الكلمة
    .replace(/ة/g, 'ه')
    // توحيد الياء والفرق بين ى وي
    .replace(/ى/g, 'ي')
    // توحيد الهمزات على الواو والياء
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي');
}

/**
 * دالة المطابقة الذكية للبحث في أسماء السور أو القراء
 */
export function matchArabicSearch(sourceText, queryText) {
  if (!queryText) return true;
  if (!sourceText) return false;

  const normalizedSource = normalizeArabic(sourceText);
  const normalizedQuery = normalizeArabic(queryText);

  // إذا كان الاستعلام رقماً وكان النص يحتوي هذا الرقم
  if (!isNaN(queryText) && sourceText.toString() === queryText.toString()) {
    return true;
  }

  return normalizedSource.includes(normalizedQuery);
}
