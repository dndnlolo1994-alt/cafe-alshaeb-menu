# كافيه الشعب — المنيو الرقمي
# Cafe AlShaeb — Digital Menu

منيو رقمي ثنائي اللغة (عربي/إنجليزي)، مبني للهاتف أولًا، يُفتح عبر رابط مباشر أو QR Code.

A mobile-first bilingual (Arabic/English) digital menu, served from a static build and openable from a plain link or a QR code.

## 🔗 المنيو المباشر / Live menu

**https://dndnlolo1994-alt.github.io/cafe-alshaeb-menu/**

رمز QR جاهز للطباعة في `public/qr/`:

| الملف | الاستخدام |
|---|---|
| `menu-qr-card.png` | بطاقة كاملة باسم الكافيه — جاهزة للطباعة ووضعها على الطاولات |
| `menu-qr.png` | الرمز وحده، 1200 بكسل |
| `menu-qr.svg` | نسخة متجهة تكبر لأي مقاس طباعة بلا فقدان جودة |

لإعادة توليدها بعد تغيير الرابط:

```bash
npm run qr
```

يقرأ السكربت `siteUrl` من `src/config/site.ts`، فلا يمكن أن يشير الرمز إلى عنوان قديم.

**النشر تلقائي:** أي `git push` على `main` يشغّل فحص الأنواع والـlint والاختبارات ثم يبني الموقع وينشره. إذا فشل أي اختبار — مثل سعر خاطئ — يتوقف النشر ولا يصل الخطأ للزبائن.

---

## التشغيل / Running

```bash
npm install
```

خادم التطوير / development server:

```bash
npm run dev
```

بناء نسخة الإنتاج / production build:

```bash
npm run build
```

معاينة نسخة الإنتاج محليًا / preview the production build:

```bash
npm run preview
```

الفحوصات / checks:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm test
```

الناتج النهائي في مجلد `dist/` — ملفات ثابتة فقط، تُرفع على أي استضافة (Netlify، Vercel، GitHub Pages، أو استضافة عادية). المسارات نسبية، فيعمل الموقع من جذر النطاق أو من مجلد فرعي.

---

## تعديل صنف أو سعر / Editing an item or a price

كل بيانات المنيو في ملف واحد: **`src/data/menu.ts`**. لا حاجة للمساس بأي مكوّن واجهة.

### تغيير سعر

ابحث عن الصنف وغيّر الرقم:

```ts
{ id: 'cappuccino', category: 'hot-drinks', name: { ar: 'كابتشينو', en: 'Cappuccino' },
  variants: one(2.55), ... }
//                ↑ غيّر هذا الرقم فقط
```

للصنف متعدد الأحجام:

```ts
variants: [
  { id: 'g250',  label: SIZE.g250,        price: 6 },   // ← غيّر هنا
  { id: 'g500',  label: SIZE.g500family,  price: 11 },
  { id: 'g1000', label: SIZE.g1000family, price: 21 },
],
```

### إخفاء صنف غير متوفر

```ts
available: false
```

يختفي من الصفحة والبحث وبيانات Schema.org، ويبقى في الملف لإعادته لاحقًا.

### إضافة صنف جديد

انسخ أي سطر موجود، وغيّر `id` (يجب أن يكون فريدًا)، والاسمين، والسعر، و`displayOrder`.

### إعادة الترتيب

- ترتيب الأقسام: `displayOrder` في مصفوفة `categories`.
- ترتيب الأصناف داخل القسم: `displayOrder` في الصنف.

### إضافة أكثر من حجم لصنف

```ts
variants: [
  { id: 'small',  label: { ar: 'صغير', en: 'Small' },  price: 2.00 },
  { id: 'large',  label: { ar: 'كبير', en: 'Large' },  price: 3.00 },
],
```

### إضافة خيارات بلا سعر إضافي (نكهات)

```ts
options: [
  { ar: 'فانيلا', en: 'Vanilla' },
  { ar: 'كراميل', en: 'Caramel' },
],
```

تظهر داخل نافذة التفاصيل، ويشملها البحث.

---

## إضافة صورة لصنف / Adding a photo to an item

حاليًا **لا يوجد أي صنف بصورة**، لأن `/pic` لا تحتوي على صور مؤكدة للأطباق — التفاصيل في `MENU_REPORT.md` القسم 6.

لإضافة صورة حقيقية:

1. ضع الصورة في `public/images/menu/` باسم إنجليزي واضح، ويفضَّل بصيغة WebP.
2. أضف الحقلين في الصنف:

```ts
image: 'images/menu/shish-tawook.webp',
imageAlt: {
  ar: 'شيش طاووق مشوي',
  en: 'Grilled shish tawook',
},
```

تظهر البطاقة تلقائيًا بنسبة 16:10 مع `object-fit: cover`، وتحميل كسول، ومعالجة تلقائية لفشل التحميل (تعود البطاقة نصية بدل إظهار صورة مكسورة).

---

## معلومات المكان / Venue details

في **`src/config/site.ts`**. الهاتف والعنوان وساعات العمل غير موجودة في صور `/pic`، فتُركت فارغة عمدًا:

```ts
contact: {
  phone:    { value: '', enabled: true },
  whatsapp: { value: '', enabled: true },   // بصيغة دولية بدون +، مثل 9627XXXXXXXX
  email:    { value: '', enabled: true },
},
address: { ar: '', en: '', mapUrl: '' },
openingHours: [],
siteUrl: '',   // ضع رابط الموقع النهائي — يلزم لصورة المشاركة و QR
```

**أي قيمة فارغة لا تظهر للزائر إطلاقًا** ولا تُدرج في بيانات Schema.org. اكتب القيمة فيظهر صفها تلقائيًا.

### تشغيل/إيقاف مقدمة الكتاب

```ts
features: {
  bookIntro: true,      // false لتعطيلها نهائيًا
  defaultLang: 'ar',    // اللغة الافتراضية لأول زيارة
}
```

---

## بنية المشروع / Project structure

```
pic/                        الصور الأصلية — للقراءة فقط، لم تُعدَّل أو تُحذف
public/
  brand/                    الشعار والأيقونات، مشتقة آليًا من pic/logo.jpeg
  manifest.webmanifest      إعداد PWA
scripts/
  prepare-images.mjs        يشتق أصول الهوية من الشعار (npm run images)
src/
  data/menu.ts              ← كل الأصناف والأسعار
  config/site.ts            ← معلومات المكان والإعدادات
  i18n/                     اللغة والاتجاه ونصوص الواجهة
  components/
    CategoryEmblem.tsx      ← رسوم الأقسام (SVG مرسومة، ليست صورًا)
    CategoryGrid.tsx        شبكة الأقسام في الصفحة الأولى
  hooks/                    مقدمة الكتاب
  utils/search.ts           تطبيع البحث العربي/الإنجليزي وتنسيق السعر
  styles/                   tokens · base · components
  __tests__/                اختبارات البيانات والبحث
MENU_REPORT.md              تقرير الاستخراج والحالات التي تحتاج تأكيدًا
```

### نموذج البيانات

الحقول المطلوبة كلها مدعومة، لكن العربي والإنجليزي مخزَّنان كزوج `{ ar, en }` بدل حقلين منفصلين، حتى لا تتكرر البيانات ولا تفترق ترجمة عن أخرى:

| الحقل المطلوب | مكانه في النموذج |
|---|---|
| `id` | `item.id` |
| `category_ar` / `category_en` | `categories[].name.ar` / `.en` عبر `item.category` |
| `name_ar` / `name_en` | `item.name.ar` / `.en` |
| `description_ar` / `description_en` | `item.description?.ar` / `.en` |
| `price` | `item.variants[].price` |
| `currency` | `siteConfig.currency` (عام) |
| `size_or_variant` | `item.variants[].label` |
| `image` | `item.image` |
| `image_alt_ar` / `image_alt_en` | `item.imageAlt.ar` / `.en` |
| `display_order` | `item.displayOrder` |
| `available` | `item.available` |
| `ocr_source` | `item.ocrSource` |
| `verification_status` | `item.verificationStatus` |

---

## التقنيات / Stack

React 19 · TypeScript · Vite 7 · Vitest — بلا أي مكتبة واجهة أو حركة إضافية. حركة فتح الكتاب و RTL/LTR مبنيان بـ CSS خالص.

- **التصفح:** الصفحة الأولى شبكة أقسام، والضغط على قسم يعرض أصنافه وحدها — بدل تمرير 114 صنفًا في صفحة واحدة.
- **رسوم الأقسام:** SVG مرسومة بخط واحد بأسلوب ختم الشعار، ترث لون النص فتعمل في الوضعين الفاتح والداكن. ليست صور طعام ولا تدّعي تمثيل طبق حقيقي. لإضافة قسم جديد أضف رسمه في `CategoryEmblem.tsx` — يوجد اختبار يمنع نسيانه.
- **الثيم:** فاتح وداكن، يتبع إعداد الهاتف تلقائيًا. الألوان كلها عبر طبقة رموز دلالية في `tokens.css`؛ الوضع الداكن يعيد تعريف تلك الطبقة فقط، وغلاف الكتاب يبقى أحمر في الحالتين لأنه «شيء مادي».
- **الاتجاه:** كل التنسيقات تستخدم الخصائص المنطقية (`margin-inline`، `inset-inline`)، فلا يوجد ملف RTL منفصل.
- **الحركة:** تحترم `prefers-reduced-motion` وتتحول إلى Fade بسيط.
- **الوصولية:** تباين AAA (7.3:1 إلى 16.6:1)، أهداف لمس ≥ 44px، تنقل كامل بلوحة المفاتيح، حصر تركيز داخل النافذة، ونصوص بديلة.
- **الأداء:** ‎~73 kB JS مضغوط + ‎~4 kB CSS، بلا صور ثقيلة، وبلا انزياح تخطيط.

### الخطوط

يُحمَّل خط **Cairo** من Google Fonts مع `display=swap` و`preconnect`. إذا تعذّر تحميله (بلا إنترنت) يعود الموقع تلقائيًا إلى خط النظام العربي، ويبقى المنيو مقروءًا بالكامل.

---

## أصول الهوية / Brand assets

```bash
npm run images
```

يقرأ `pic/logo.jpeg` (بلا تعديل عليه) ويولّد في `public/brand/`: شعارًا شفافًا (WebP + PNG)، أيقونات 32/180/192/512، وصورة Open Graph بألوان الهوية.

لم يُعَد تصميم الشعار — أُزيلت خلفية الورق الممسوحة فقط بتعبئة من الحواف، وحُفظ شكل القرص والإطار المسنّن كما هو.
