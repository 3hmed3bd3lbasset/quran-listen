import React from 'react';
import { 
  HelpCircle, WifiOff, ShieldCheck, Heart, Sparkles, 
  Users, CheckCircle2, Bookmark, Flame, Zap
} from 'lucide-react';

export function WhyView() {
  return (
    <div className="view-container">
      {/* HERO BANNER - WHY VIEW */}
      <div className="hero-banner why-hero">
        <div className="hero-content text-center max-w-3xl mx-auto">
          <div className="hero-gift-badge why-badge">
            <HelpCircle size={14} />
            <span>ليه عملنا المنصة دي؟</span>
          </div>

          <h2 className="hero-title font-amiri text-3xl md:text-4xl">
            حكاية منصة القرآن الكريم
          </h2>
          <p className="hero-description text-sm md:text-base">
            كل حاجة محتاجها في مكان واحد، سريعة، خفيفة، وبتوفر باقة الإنترنت بتاعتك من غير أي إعلانات تضايقك.
          </p>
        </div>
      </div>

      {/* WHY CONTENT MAIN SECTION */}
      <main className="main-content-area max-w-5xl mx-auto">
        <div className="why-grid-layout">
          
          {/* Section 1: ليه المنصة دي بالذات؟ */}
          <div className="why-section-card">
            <h3 className="why-card-title font-amiri">
              <Zap size={22} className="text-amber-500" />
              <span>ليه عملنا المنصة دي؟</span>
            </h3>
            <p className="why-egyptian-text">
              عملنا المنصة دي عشان نقدملك تجربة سماع وتصفح للقرآن الكريم تكون <strong>رايقة وبسيطة</strong>، من غير لف ودوران ولا إعلانات مزعجة تفصلك عن خشوعك. وكمان عشان نجمع بين أمهات الكتب والأذكار وأصوات القراء القدام والجداد في مكان واحد خفيف يشتغل معاك في أي مكان.
            </p>
          </div>

          {/* Section 2: توفير باقة الإنترنت */}
          <div className="why-section-card">
            <h3 className="why-card-title font-amiri">
              <WifiOff size={22} className="text-amber-500" />
              <span>بتوفر في باقة الإنترنت جداً (عكس أي مشغل تاني)</span>
            </h3>
            <p className="why-egyptian-text">
              أي مشغل تاني أو موقع بيفضل يسحب ويحمل ملفات صوت وصور تقيلة في الخلفية من غير ما تحس ويفاجئك إن الباقة خلصت. هنا في المنصة:
            </p>
            <ul className="why-list-items">
              <li><strong>مفيش تحميل تلقائي:</strong> مفيش ولا ملف صوت بيتحمل غير لما تدوس بنفسك على زرار التشغيل.</li>
              <li><strong>كاش ذكي للمعلومات الوصفية:</strong> أسماء السور والقراء بنحفظهم في متصفحك، يعني مش كل ما تفتح الصفحة نسحب بيانات جديدة ونستهلك باقتك.</li>
              <li><strong>جودة صوت محسنة:</strong> ملفات الصوت مضغوطة باحترافية عشان تديك جودة ناصعة بأقل استهلاك ممكن للميجابايتس.</li>
            </ul>
          </div>

          {/* Section 3: الأرقام في المنصة */}
          <div className="why-stats-row">
            <div className="why-stat-card">
              <span className="stat-number font-outfit">243</span>
              <span className="stat-label">قارئ عالمي وإذاعي</span>
            </div>
            <div className="why-stat-card">
              <span className="stat-number font-outfit">114</span>
              <span className="stat-label">سورة شريفة كاملة</span>
            </div>
            <div className="why-stat-card">
              <span className="stat-number font-outfit">132</span>
              <span className="stat-label">باب من أذكار حصن المسلم</span>
            </div>
          </div>

          {/* Section 4: ميزات ذكية وسرية */}
          <div className="why-section-card">
            <h3 className="why-card-title font-amiri">
              <Sparkles size={22} className="text-amber-500" />
              <span>ميزات ذكية هتعجبك في المنصة</span>
            </h3>
            <p className="why-egyptian-text">
              المنصة فيها أفكار معمولة مخصوص عشان تريحك وتوفر وقتك:
            </p>
            <ul className="why-list-items">
              <li>
                <strong>تقدمك محفوظ تلقائياً (من غير ما تعمل حساب):</strong> لما بتدخل وتعمل تسبيح أو استغفار في السبحة الإلكترونية، أو تضيف قارئ للمفضلة، كل ده بيتحفظ تلقائياً في جهازك (مربوط بالـ IP والمتصفح بتاعك)، يعني لو قفلت الموقع ورجعت بعد سنة هتلاقي تسبيحك ومفضلتك زي ما سبتهم بالظبط!
              </li>
              <li>
                <strong>مشغل صوتي ثابت ومستقر:</strong> تقدر تشغل التلاوة وتفضل تلف في الموقع، تقرأ أذكار، تبحث عن قراء تانيين، والصوت شغال تحت من غير ما يقطع نهائي.
              </li>
              <li>
                <strong>تحميل سريع مباشر:</strong> بضغطة زرار واحدة تقدر تحمل أي سورة تعجبك بملف MP3 متسمي بالاسم والرقم والقارئ بشكل منظم عشان تشغله بدون إنترنت.
              </li>
              <li>
                <strong>الوضع الليلي والفاتح:</strong> عشان ترتاح بالليل وتوفر شحن موبايلك كمان.
              </li>
            </ul>
          </div>

          {/* Section 5: الأسباب الحقيقية وراء المشروع */}
          <div className="why-section-card">
            <h3 className="why-card-title font-amiri">
              <Heart size={22} className="text-amber-500" />
              <span>الأسباب اللي خلتنا نعمل المشروع ده</span>
            </h3>
            <p className="why-egyptian-text">
              المشروع ده وراه هدف ورسالة:
            </p>
            <ul className="why-list-items">
              <li><strong>صدقة جارية:</strong> حابين يكون الموقع ده صدقة جارية ونشر للقرآن الكريم، ولكل واحد بيساهم في استخدامه ونشره أجر إن شاء الله.</li>
              <li><strong>إحياء تراث القراء العمالقة:</strong> زي ما ضيفنا الشيخ أبو العينين شعيشع والشيخ علاء عقل بتسجيلاتهم الإذاعية النادرة عشان متتنساش وتفضل تتردد في قلوبنا.</li>
              <li><strong>البساطة والسهولة:</strong> بعيداً عن كثرة التعقيدات والبرامج التقيلة، ده موقع ويب خفيف يفتح بضغطة زرار واحدة على أي موبايل قديم أو جديد.</li>
            </ul>
          </div>

        </div>
      </main>
    </div>
  );
}
