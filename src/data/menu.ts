/**
 * Cafe AlShaeb / كافيه الشعب — menu transcribed from the paper menu in /pic.
 *
 * Every name and price here was read off the photographs and then re-checked
 * against a magnified crop of the same line. Nothing is inferred: where the
 * print was genuinely unclear the item carries
 * `verificationStatus: 'needs_confirmation'` and is listed in MENU_REPORT.md.
 *
 * To change a price, edit the `price` number on the relevant variant.
 * To hide an item, set `available: false` — it stays in the file.
 * To add a photo, set `image` to a path under /public plus `imageAlt`.
 */
import type { Category, MenuItem, Variant } from '../types'

/** Source pages in /pic, referenced by every row transcribed from them. */
const SRC = {
  pasta: 'pic/WhatsApp Image 2026-08-15 at 15.12.37.jpeg',
  snacks: 'pic/WhatsApp Image 2026-08-15 at 15.12.38.jpeg',
  smoked: 'pic/WhatsApp Image 2026-08-15 at 15.12.38 (1).jpeg',
  grills: 'pic/WhatsApp Image 2026-08-15 at 15.12.38 (3).jpeg',
  drinks: 'pic/WhatsApp Image 2026-08-15 at 15.12.38 (4).jpeg',
  sweets: 'pic/WhatsApp Image 2026-08-15 at 15.12.38 (5).jpeg',
  juices: 'pic/WhatsApp Image 2026-08-15 at 15.12.39.jpeg',
} as const

/** Single-price item. */
const one = (price: number): Variant[] => [{ id: 'standard', price }]

const SIZE = {
  g250: { ar: '250 غرام (فردية)', en: '250 gm (individual)' },
  g300: { ar: '300 غرام (فردية)', en: '300 gm (individual)' },
  g500: { ar: '500 غرام', en: '500 gm' },
  g500family: { ar: '500 غرام (عائلية)', en: '500 gm (family)' },
  g1000: { ar: '1000 غرام', en: '1000 gm' },
  g1000family: { ar: '1000 غرام (عائلية)', en: '1000 gm (family)' },
} as const

/**
 * Menu order: the substantial dishes lead, then lighter food, then drinks,
 * then dessert and sheshah. The paper menu's own page sequence is unknown from
 * the photographs, so ordering the sections is a presentation choice — change
 * a `displayOrder` to re-order, nothing else depends on it. Item order inside
 * each section still matches the printed page exactly.
 */
export const categories: Category[] = [
  { id: 'grills', name: { ar: 'مشاوي', en: 'Grills' }, displayOrder: 1, ocrSource: SRC.grills },
  { id: 'smoked-meat', name: { ar: 'لحم مدخن', en: 'Smoked Meat' }, displayOrder: 2, ocrSource: SRC.smoked },
  { id: 'main-course', name: { ar: 'الطبق الرئيسي', en: 'Main Course' }, displayOrder: 3, ocrSource: SRC.pasta },
  { id: 'fish-seafood', name: { ar: 'أسماك و سي فود', en: 'Fish & Seafood' }, displayOrder: 4, ocrSource: SRC.pasta },
  { id: 'pasta', name: { ar: 'الباستا', en: 'Pasta' }, displayOrder: 5, ocrSource: SRC.pasta },
  { id: 'sandwich', name: { ar: 'ساندويش', en: 'Sandwich' }, displayOrder: 6, ocrSource: SRC.grills },
  { id: 'snacks', name: { ar: 'سناكات', en: 'Snacks' }, displayOrder: 7, ocrSource: SRC.snacks },
  { id: 'kumpir', name: { ar: 'كومبير', en: 'Kumpir' }, displayOrder: 8, ocrSource: SRC.snacks },
  { id: 'children', name: { ar: 'وجبة الأطفال', en: "Children's Meal" }, displayOrder: 9, ocrSource: SRC.snacks },
  { id: 'hot-drinks', name: { ar: 'مشروبات ساخنة', en: 'Hot Drinks' }, displayOrder: 10, ocrSource: SRC.drinks },
  { id: 'cold-drinks', name: { ar: 'مشروبات باردة', en: 'Cold Drinks' }, displayOrder: 11, ocrSource: SRC.drinks },
  { id: 'cocktail', name: { ar: 'كوكتيل طبيعي', en: 'Fresh Cocktails' }, displayOrder: 12, ocrSource: SRC.juices },
  { id: 'fruit-juice', name: { ar: 'عصير طبيعي', en: 'Fresh Juice' }, displayOrder: 13, ocrSource: SRC.juices },
  { id: 'chiller', name: { ar: 'شيلر', en: 'Chiller' }, displayOrder: 14, ocrSource: SRC.juices },
  { id: 'sweets', name: { ar: 'حلويات', en: 'Sweets' }, displayOrder: 15, ocrSource: SRC.sweets },
  { id: 'ice-cream', name: { ar: 'آيس كريم', en: 'Ice Cream' }, displayOrder: 16, ocrSource: SRC.sweets },
  { id: 'sheshah', name: { ar: 'أراجيل', en: 'Sheshah' }, displayOrder: 17, ocrSource: SRC.sweets },
]

export const items: MenuItem[] = [
  // ── Pasta / الباستا ──────────────────────────────────────────────────────
  { id: 'fettuccine-alfredo', category: 'pasta', name: { ar: 'فوتوشيني الفريدو', en: 'Fettuccine Alfredo' }, variants: one(3.75), displayOrder: 1, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'spaghetti-alpesto', category: 'pasta', name: { ar: 'سباغيتي البيستو', en: 'Spaghetti Alpesto' }, variants: one(3.5), displayOrder: 2, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'spaghetti-bolognese', category: 'pasta', name: { ar: 'سباغيتي بولنيز', en: 'Spaghetti Bolognese' }, variants: one(3.5), displayOrder: 3, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'penna-arrabbiata', category: 'pasta', name: { ar: 'بينا اربياتا', en: 'Penna Arrabbiata' }, variants: one(3.25), displayOrder: 4, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'lasagna', category: 'pasta', name: { ar: 'لزانيا', en: 'Lasagna' }, variants: one(4.5), displayOrder: 5, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'fettuccine-seafood', category: 'pasta', name: { ar: 'فوتوشيني سي فود', en: 'Fettuccine Seafood' }, variants: one(6), displayOrder: 6, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'spaghetti-seafood', category: 'pasta', name: { ar: 'سباغيتي سي فود', en: 'Spaghetti Seafood' }, variants: one(5), displayOrder: 7, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },

  // ── Main Course / الطبق الرئيسي ──────────────────────────────────────────
  { id: 'grilled-chicken-breast', category: 'main-course', name: { ar: 'صدر دجاج مشوي', en: 'Grilled Chicken' }, description: { ar: 'صدر دجاج', en: 'Breast' }, variants: one(5.95), displayOrder: 1, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'sizzling-fajitas', category: 'main-course', name: { ar: 'فاهيتا سيزلنغ', en: 'Sizzling Fajitas' }, variants: one(5.95), displayOrder: 2, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'creamy-chicken-foukhara', category: 'main-course', name: { ar: 'فخارة دجاج بالكريمه', en: 'Creamy Chicken' }, description: { ar: 'فخارة', en: 'Foukhara (clay pot)' }, variants: one(4), displayOrder: 3, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'curry-chicken-foukhara', category: 'main-course', name: { ar: 'فخارة دجاج بالكاري', en: 'Curry Chicken' }, description: { ar: 'فخارة', en: 'Foukhara (clay pot)' }, variants: one(5), displayOrder: 4, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'meat-foukhara-vegetables', category: 'main-course', name: { ar: 'فخارة لحمة بالخضار', en: 'Meat' }, description: { ar: 'فخارة مع الخضار', en: 'Foukhara with vegetables' }, variants: one(6), displayOrder: 5, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'fillet-steak', category: 'main-course', name: { ar: 'ستيك فيلية عجل', en: 'Fillet Steak' }, variants: one(9), displayOrder: 6, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'roast-beef', category: 'main-course', name: { ar: 'ستيك روز بيف', en: 'Roast Beef' }, variants: one(9), displayOrder: 7, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },

  // ── Fish & Seafood / أسماك و سي فود ──────────────────────────────────────
  { id: 'whole-fish', category: 'fish-seafood', name: { ar: 'سمك', en: 'Whole Fish' }, description: { ar: 'مقلي / مشوي', en: 'Fried / grilled' }, variants: one(8), displayOrder: 1, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'fish-fillet', category: 'fish-seafood', name: { ar: 'فيلية', en: 'Fish Fillet' }, description: { ar: 'مقلي / مشوي', en: 'Fried / grilled' }, variants: one(7), displayOrder: 2, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'fish-and-chips', category: 'fish-seafood', name: { ar: 'فيش الد شيبس', en: 'Fish & Chips' }, variants: one(12), displayOrder: 3, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'seafood-bucket', category: 'fish-seafood', name: { ar: 'سطل سي فود', en: 'Seafood Bucket' }, variants: one(10), displayOrder: 4, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },
  { id: 'alshaeb-seafood-bucket', category: 'fish-seafood', name: { ar: 'سطل سي فود الشعب', en: 'Alshaeb Seafood Bucket' }, variants: one(16), displayOrder: 5, available: true, ocrSource: SRC.pasta, verificationStatus: 'verified' },

  // ── Snacks / سناكات ──────────────────────────────────────────────────────
  { id: 'alshaeab-potatoes', category: 'snacks', name: { ar: 'بطاطا الشعب', en: 'Al Shaeab Potatoes' }, variants: one(2.25), displayOrder: 1, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'mexican-nachos', category: 'snacks', name: { ar: 'ناتشو مكسيكي', en: 'Mexican Nachos' }, variants: one(3.25), displayOrder: 2, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'mozzarella-sticks', category: 'snacks', name: { ar: 'موزاريلا ستيكس', en: 'Mozzarella Sticks' }, variants: one(2.75), displayOrder: 3, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'chicken-fingers', category: 'snacks', name: { ar: 'أصابع دجاج', en: 'Chicken Fingers' }, variants: one(2.75), displayOrder: 4, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'fish-fingers', category: 'snacks', name: { ar: 'أصابع سمك', en: 'Fish Fingers' }, variants: one(3), displayOrder: 5, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'calamari-rings', category: 'snacks', name: { ar: 'كلاماري حلقات', en: 'Calamari Rings' }, variants: one(4), displayOrder: 6, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },

  // ── Kumpir / كومبير ──────────────────────────────────────────────────────
  { id: 'classic-kumpir', category: 'kumpir', name: { ar: 'كومبير كلاسيك', en: 'Classic Kumpir' }, variants: one(1.25), displayOrder: 1, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'meat-kumpir', category: 'kumpir', name: { ar: 'كومبير لحوم', en: 'Meat Kumpir' }, variants: one(2.75), displayOrder: 2, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'vegetable-kumpir', category: 'kumpir', name: { ar: 'كومبير خضار', en: 'Vegetable Kumpir' }, variants: one(1.75), displayOrder: 3, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'mexican-kumpir', category: 'kumpir', name: { ar: 'كومبير مكسيكي', en: 'Mexican Kumpir' }, variants: one(2.75), displayOrder: 4, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'alshaeab-kumpir', category: 'kumpir', name: { ar: 'كومبير الشعب', en: 'Al Shaeab Kumpir' }, variants: one(2.75), displayOrder: 5, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },

  // ── Children's Meal / وجبة الأطفال ───────────────────────────────────────
  { id: 'mini-pizza', category: 'children', name: { ar: 'ميني بيتزا', en: 'Mini Pizza' }, variants: one(1.95), displayOrder: 1, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'mini-burger', category: 'children', name: { ar: 'ميني برغر', en: 'Mini Burger' }, variants: one(1.95), displayOrder: 2, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'neapolitan-spaghetti', category: 'children', name: { ar: 'سباغيتي نابولي', en: 'Neapolitan Spaghetti' }, variants: one(1.75), displayOrder: 3, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'chicken-nuggets', category: 'children', name: { ar: 'تشكن نجتس', en: 'Chicken Nuggets' }, variants: one(1.75), displayOrder: 4, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'french-fries', category: 'children', name: { ar: 'فرنش فرايز', en: 'French Fries' }, variants: one(1.75), displayOrder: 5, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },
  { id: 'potato-wedges', category: 'children', name: { ar: 'بطاطا ودجيز', en: 'Potato Wedges' }, variants: one(1.75), displayOrder: 6, available: true, ocrSource: SRC.snacks, verificationStatus: 'verified' },

  // ── Smoked Meat / لحم مدخن ───────────────────────────────────────────────
  {
    id: 'smoked-lamb', category: 'smoked-meat',
    name: { ar: 'لحم مدخن بلدي / خروف', en: 'Smoked Lamb' },
    description: { ar: 'بلدي', en: 'Local' },
    variants: [
      { id: 'g300', label: SIZE.g300, price: 7 },
      { id: 'g500', label: SIZE.g500, price: 13 },
      { id: 'g1000', label: SIZE.g1000, price: 24 },
    ],
    displayOrder: 1, available: true, ocrSource: SRC.smoked, verificationStatus: 'verified',
  },
  {
    id: 'smoked-beef', category: 'smoked-meat',
    name: { ar: 'لحم مدخن بلدي / عجل', en: 'Smoked Beef' },
    description: { ar: 'بلدي', en: 'Local' },
    variants: [
      { id: 'g300', label: SIZE.g300, price: 6 },
      { id: 'g500', label: SIZE.g500, price: 10 },
      { id: 'g1000', label: SIZE.g1000, price: 18 },
    ],
    displayOrder: 2, available: true, ocrSource: SRC.smoked, verificationStatus: 'verified',
  },
  {
    id: 'smoked-beef-imported', category: 'smoked-meat',
    name: { ar: 'لحم مدخن مستورد / عجل', en: 'Smoked Beef Imported' },
    description: { ar: 'مستورد', en: 'Imported' },
    variants: [
      { id: 'g300', label: SIZE.g300, price: 5 },
      { id: 'g500', label: SIZE.g500, price: 9 },
      { id: 'g1000', label: SIZE.g1000, price: 17 },
    ],
    displayOrder: 3, available: true, ocrSource: SRC.smoked, verificationStatus: 'verified',
  },

  // ── Grills / مشاوي ───────────────────────────────────────────────────────
  {
    id: 'romanian-mixed-grill', category: 'grills',
    name: { ar: 'مشاوي مشكلة روماني', en: 'Romanian Mixed Grill' },
    variants: [
      { id: 'g250', label: SIZE.g250, price: 6 },
      { id: 'g500', label: SIZE.g500family, price: 11 },
      { id: 'g1000', label: SIZE.g1000family, price: 21 },
    ],
    displayOrder: 1, available: true, ocrSource: SRC.grills, verificationStatus: 'verified',
  },
  {
    id: 'local-mixed-grill', category: 'grills',
    name: { ar: 'مشاوي مشكلة بلدي', en: 'Local Mixed Grill' },
    variants: [
      { id: 'g250', label: SIZE.g250, price: 7 },
      { id: 'g500', label: SIZE.g500family, price: 13 },
      { id: 'g1000', label: SIZE.g1000family, price: 25 },
    ],
    displayOrder: 2, available: true, ocrSource: SRC.grills, verificationStatus: 'verified',
  },
  {
    id: 'shish-tawook', category: 'grills',
    name: { ar: 'شيش طاووق', en: 'Shish Tawook' },
    variants: [
      { id: 'g250', label: SIZE.g250, price: 3.5 },
      { id: 'g500', label: SIZE.g500family, price: 6 },
      { id: 'g1000', label: SIZE.g1000family, price: 11 },
    ],
    displayOrder: 3, available: true, ocrSource: SRC.grills, verificationStatus: 'verified',
  },
  {
    id: 'local-kebab', category: 'grills',
    name: { ar: 'كباب بلدي', en: 'Local Kebab' },
    variants: [
      { id: 'g500', label: SIZE.g500family, price: 11 },
      { id: 'g1000', label: SIZE.g1000family, price: 20 },
    ],
    displayOrder: 4, available: true, ocrSource: SRC.grills, verificationStatus: 'verified',
  },
  {
    id: 'romanian-kebab', category: 'grills',
    name: { ar: 'كباب روماني', en: 'Romanian Kebab' },
    variants: [
      { id: 'g500', label: SIZE.g500family, price: 9 },
      { id: 'g1000', label: SIZE.g1000family, price: 16 },
    ],
    displayOrder: 5, available: true, ocrSource: SRC.grills, verificationStatus: 'verified',
  },
  {
    id: 'half-chicken-tikka', category: 'grills',
    name: { ar: 'نص تكا دجاج', en: 'Half Chicken Tikka' },
    variants: one(4), displayOrder: 6, available: true, ocrSource: SRC.grills,
    verificationStatus: 'needs_confirmation',
    note: { ar: 'مدرج ضمن قائمة 1000 غرام في المنيو الورقي', en: 'Printed under the 1000 gm heading on the paper menu' },
  },
  {
    id: 'whole-chicken-tikka', category: 'grills',
    name: { ar: 'دجاج تكا كاملة', en: 'Whole Chicken Tikka' },
    variants: one(8), displayOrder: 7, available: true, ocrSource: SRC.grills,
    verificationStatus: 'needs_confirmation',
    note: { ar: 'مدرج ضمن قائمة 1000 غرام في المنيو الورقي', en: 'Printed under the 1000 gm heading on the paper menu' },
  },
  {
    id: 'arayes', category: 'grills',
    name: { ar: 'عرايس', en: 'Arayes' },
    variants: one(1.25), displayOrder: 8, available: true, ocrSource: SRC.grills,
    verificationStatus: 'needs_confirmation',
    note: { ar: 'مدرج ضمن قائمة 1000 غرام في المنيو الورقي', en: 'Printed under the 1000 gm heading on the paper menu' },
  },

  // ── Sandwich / ساندويش ───────────────────────────────────────────────────
  { id: 'creamy-chicken-sandwich', category: 'sandwich', name: { ar: 'ساندويش دجاج بالكريمة', en: 'Creamy Chicken Sandwich' }, variants: one(3.25), displayOrder: 1, available: true, ocrSource: SRC.grills, verificationStatus: 'verified' },
  { id: 'quesadilla-sandwich', category: 'sandwich', name: { ar: 'ساندويش كساديا', en: 'Quesadilla Sandwich' }, variants: one(3.25), displayOrder: 2, available: true, ocrSource: SRC.grills, verificationStatus: 'verified' },
  { id: 'zinger-sandwich', category: 'sandwich', name: { ar: 'ساندويش زنجر', en: 'Zinger Sandwich' }, variants: one(3.25), displayOrder: 3, available: true, ocrSource: SRC.grills, verificationStatus: 'verified' },
  { id: 'fajita-sandwich', category: 'sandwich', name: { ar: 'ساندويش فاهيتا', en: 'Fajita Sandwich' }, variants: one(3.25), displayOrder: 4, available: true, ocrSource: SRC.grills, verificationStatus: 'verified' },
  { id: 'turkey-sandwich', category: 'sandwich', name: { ar: 'ساندويش تيركي', en: 'Turkey Sandwich' }, variants: one(3.25), displayOrder: 5, available: true, ocrSource: SRC.grills, verificationStatus: 'verified' },
  { id: 'beef-burger-150', category: 'sandwich', name: { ar: 'بيف برغر 150 غرام', en: 'Beef Burger 150gm' }, variants: one(3.25), displayOrder: 6, available: true, ocrSource: SRC.grills, verificationStatus: 'verified' },
  { id: 'halloumi-sandwich', category: 'sandwich', name: { ar: 'ساندويش حلوم', en: 'Halloumi Sandwich' }, variants: one(3), displayOrder: 7, available: true, ocrSource: SRC.grills, verificationStatus: 'verified' },

  // ── Hot Drinks / مشروبات ساخنة ───────────────────────────────────────────
  { id: 'single-espresso', category: 'hot-drinks', name: { ar: 'اسبرسو سنغل', en: 'Single Espresso' }, variants: one(1.5), displayOrder: 1, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'double-espresso', category: 'hot-drinks', name: { ar: 'اسبرسو دبل', en: 'Double Espresso' }, variants: one(1.9), displayOrder: 2, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'americano', category: 'hot-drinks', name: { ar: 'امريكانو', en: 'Americano' }, variants: one(2), displayOrder: 3, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'coffee-latte', category: 'hot-drinks', name: { ar: 'كوفي لاتيه', en: 'Coffee Latte' }, variants: one(2.55), displayOrder: 4, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'spanish-latte', category: 'hot-drinks', name: { ar: 'سبانيش لاتيه', en: 'Spanish Latte' }, variants: one(2.55), displayOrder: 5, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'flat-white', category: 'hot-drinks', name: { ar: 'فلات وايت', en: 'Flat White' }, variants: one(2.55), displayOrder: 6, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'cappuccino', category: 'hot-drinks', name: { ar: 'كابتشينو', en: 'Cappuccino' }, variants: one(2.55), displayOrder: 7, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'caramel-cappuccino', category: 'hot-drinks', name: { ar: 'كابتشينو كارميل', en: 'Caramel Cappuccino' }, variants: one(2.55), displayOrder: 8, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'hot-chocolate', category: 'hot-drinks', name: { ar: 'هوت شوكلت', en: 'Hot Chocolate' }, variants: one(1.75), displayOrder: 9, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'caramel-macchiato', category: 'hot-drinks', name: { ar: 'كراميل ميكياتو', en: 'Caramel Macchiato' }, variants: one(2.55), displayOrder: 10, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  {
    id: 'coffee-mocha', category: 'hot-drinks',
    name: { ar: 'كوفي موكا', en: 'Coffee Mocha' },
    description: { ar: 'دارك ، وايت', en: 'Dark, White' },
    options: [
      { ar: 'دارك', en: 'Dark' },
      { ar: 'وايت', en: 'White' },
    ],
    variants: one(2.55), displayOrder: 11, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified',
  },
  { id: 'nescafe', category: 'hot-drinks', name: { ar: 'نسكافيه', en: 'Nescafe' }, variants: one(1.5), displayOrder: 12, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'ginger-lemon-honey', category: 'hot-drinks', name: { ar: 'زنجبيل ليمون و عسل', en: 'Ginger, Lemon & Honey' }, variants: one(1.75), displayOrder: 13, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'ginger-milk-honey', category: 'hot-drinks', name: { ar: 'زنجبيل حليب و عسل', en: 'Ginger, Milk & Honey' }, variants: one(1.75), displayOrder: 14, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'tea', category: 'hot-drinks', name: { ar: 'شاي', en: 'Tea' }, variants: one(0.65), displayOrder: 15, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'herbs', category: 'hot-drinks', name: { ar: 'اعشاب', en: 'Herbs' }, variants: one(0.65), displayOrder: 16, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'single-turkish-coffee', category: 'hot-drinks', name: { ar: 'قهوة تركي سنغل', en: 'Single Turkish Coffee' }, variants: one(0.95), displayOrder: 17, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'double-turkish-coffee', category: 'hot-drinks', name: { ar: 'قهوة تركي دبل', en: 'Double Turkish Coffee' }, variants: one(1.25), displayOrder: 18, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },

  // ── Cold Drinks / مشروبات باردة ──────────────────────────────────────────
  { id: 'iced-americano', category: 'cold-drinks', name: { ar: 'ايس امريكانو', en: 'Iced Americano' }, variants: one(1.8), displayOrder: 1, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'iced-latte', category: 'cold-drinks', name: { ar: 'ايس لاتيه', en: 'Iced Latte' }, variants: one(2.55), displayOrder: 2, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'iced-spanish-latte', category: 'cold-drinks', name: { ar: 'ايس سبانيش لاتيه', en: 'Iced Spanish Latte' }, variants: one(2.55), displayOrder: 3, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'iced-caramel-macchiato', category: 'cold-drinks', name: { ar: 'ايس كراميل ميكياتو', en: 'Iced Caramel Macchiato' }, variants: one(2.55), displayOrder: 4, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  { id: 'iced-mocha', category: 'cold-drinks', name: { ar: 'ايس موكا', en: 'Iced Mocha' }, variants: one(2.55), displayOrder: 5, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified' },
  {
    id: 'iced-tea', category: 'cold-drinks',
    name: { ar: 'ايس تي', en: 'Iced Tea' },
    description: { ar: 'خوخ، ليمون، مكس بيري', en: 'Peach, Lemon, Mixed Berry' },
    options: [
      { ar: 'خوخ', en: 'Peach' },
      { ar: 'ليمون', en: 'Lemon' },
      { ar: 'مكس بيري', en: 'Mixed Berry' },
    ],
    variants: one(1.75), displayOrder: 6, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified',
  },
  {
    id: 'frappuccino', category: 'cold-drinks',
    name: { ar: 'فرابتشينو', en: 'Frappuccino' },
    description: { ar: 'فانيلا، كراميل، شوكلت', en: 'Vanilla, Caramel, Chocolate' },
    options: [
      { ar: 'فانيلا', en: 'Vanilla' },
      { ar: 'كراميل', en: 'Caramel' },
      { ar: 'شوكلت', en: 'Chocolate' },
    ],
    variants: one(2.55), displayOrder: 7, available: true, ocrSource: SRC.drinks, verificationStatus: 'verified',
  },

  // ── Sweets / حلويات ──────────────────────────────────────────────────────
  { id: 'chocolate-mousse', category: 'sweets', name: { ar: 'شوكلت موس', en: 'Chocolate Mousse' }, variants: one(1.6), displayOrder: 1, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'cheesecake', category: 'sweets', name: { ar: 'تشيز كيك', en: 'Cheesecake' }, variants: one(1.6), displayOrder: 2, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'tiramisu', category: 'sweets', name: { ar: 'ترامسيو', en: 'Tiramisu' }, variants: one(1.6), displayOrder: 3, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'trilecheh', category: 'sweets', name: { ar: 'الكيكه التركية', en: 'Trilecheh' }, variants: one(1.6), displayOrder: 4, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'chocolate-crepe', category: 'sweets', name: { ar: 'كريب شوكلت', en: 'Chocolate Crepe' }, variants: one(2.25), displayOrder: 5, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'oreo-crepe', category: 'sweets', name: { ar: 'كريب أوريو', en: 'Oreo Crepe' }, variants: one(3.25), displayOrder: 6, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'pistachio-crepe', category: 'sweets', name: { ar: 'كريب بستاشيو', en: 'Pistachio Crepe' }, variants: one(3), displayOrder: 7, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'lotus-crepe', category: 'sweets', name: { ar: 'لوتس كريب', en: 'Lotus Crepe' }, variants: one(2.75), displayOrder: 8, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'classic-waffle', category: 'sweets', name: { ar: 'وافل كلاسيك', en: 'Classic Waffle' }, variants: one(2.25), displayOrder: 9, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'fruit-crepe', category: 'sweets', name: { ar: 'كريب فواكة', en: 'Fruit Crepe' }, variants: one(4.5), displayOrder: 10, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'fruit-waffle', category: 'sweets', name: { ar: 'وافل فواكة', en: 'Fruit Waffle' }, variants: one(4.5), displayOrder: 11, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'mini-pancakes', category: 'sweets', name: { ar: 'ميني بان كيك', en: 'Mini Pancakes' }, variants: one(1.75), displayOrder: 12, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },

  // ── Ice Cream / آيس كريم ─────────────────────────────────────────────────
  {
    id: 'ice-cream-scoop', category: 'ice-cream',
    name: { ar: 'آيس كريم', en: 'Ice Cream' },
    description: { ar: 'شوكلت / تشيز كيك / سنيكرز / فانيلا / اوريو / عربيه / فراوله / منجا', en: 'Chocolate / Cheesecake / Snickers / Vanilla / Oreo / Arabica / Strawberry / Mango' },
    options: [
      { ar: 'شوكلت', en: 'Chocolate' },
      { ar: 'تشيز كيك', en: 'Cheesecake' },
      { ar: 'سنيكرز', en: 'Snickers' },
      { ar: 'فانيلا', en: 'Vanilla' },
      { ar: 'اوريو', en: 'Oreo' },
      { ar: 'عربيه', en: 'Arabica' },
      { ar: 'فراوله', en: 'Strawberry' },
      { ar: 'منجا', en: 'Mango' },
    ],
    variants: one(0.85), displayOrder: 1, available: true, ocrSource: SRC.sweets,
    verificationStatus: 'needs_confirmation',
    note: { ar: 'المنيو الورقي يذكر النكهات فقط بدون اسم صنف', en: 'The paper menu lists only the flavours, with no item name' },
  },
  { id: 'mawatin-chocolate', category: 'ice-cream', name: { ar: 'شوكليت ماواتين', en: 'Mawatin Chocolate' }, variants: one(2.5), displayOrder: 2, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'totte-fruity', category: 'ice-cream', name: { ar: 'توتي فروتي', en: 'Totte Fruity' }, variants: one(2.5), displayOrder: 3, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'milk-shake', category: 'ice-cream', name: { ar: 'ملك شيك', en: 'Milk Shake' }, variants: one(2.45), displayOrder: 4, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },

  // ── Sheshah / أراجيل ─────────────────────────────────────────────────────
  {
    id: 'sheshah', category: 'sheshah',
    name: { ar: 'أرجيلة', en: 'Sheshah' },
    description: { ar: '17 نكهة للاختيار', en: '17 flavours to choose from' },
    options: [
      { ar: 'تفاحتين', en: 'Two Apples' },
      { ar: 'ليمون و نعنع', en: 'Lemon & Mint' },
      { ar: 'بطيخ ونعنع', en: 'Watermelon & Mint' },
      { ar: 'كاندي', en: 'Candy' },
      { ar: 'علكه ونعنع', en: 'Bubblegum & Mint' },
      { ar: 'علكه و قرفه', en: 'Bubblegum & Cinnamon' },
      { ar: 'علكه و مستكه', en: 'Bubblegum & Mastic' },
      { ar: 'عنب', en: 'Grapes' },
      { ar: 'عنب و توت', en: 'Grapes & Berries' },
      { ar: 'عنب و نعنع', en: 'Grapes & Mint' },
      { ar: 'بلوميست', en: 'Bloomist' },
      { ar: 'بوملو و نعنع', en: 'Pomelo & Mint' },
      { ar: 'تفاح ونعنع', en: 'Apple Mint' },
      { ar: 'برتقال ونعنع', en: 'Orange Mint' },
      { ar: 'لوف', en: 'LOVE' },
      { ar: 'علكه سهم', en: 'Arrow Bubblegum' },
      { ar: 'علكه مستكه', en: 'Mastic Bubblegum' },
    ],
    variants: one(3.4), displayOrder: 1, available: true, ocrSource: SRC.sweets,
    verificationStatus: 'needs_confirmation',
    note: { ar: 'قائمة النكهات مطبوعة بخط صغير جدًا — يرجى التأكد', en: 'The flavour list is printed very small — please confirm' },
  },
  { id: 'alshaeb-special-sheshah', category: 'sheshah', name: { ar: 'الشعب سبيشال', en: 'Alshaeb Special' }, variants: one(4.5), displayOrder: 2, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'zaghloul', category: 'sheshah', name: { ar: 'زغلول', en: 'Zaghloul' }, variants: one(2), displayOrder: 3, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },
  { id: 'add-zaghloul', category: 'sheshah', name: { ar: 'إضافة زغلول', en: 'Add Zaghloul' }, variants: one(1), displayOrder: 4, available: true, ocrSource: SRC.sweets, verificationStatus: 'verified' },

  // ── Fresh Cocktails / كوكتيل طبيعي ───────────────────────────────────────
  { id: 'melo-passion', category: 'cocktail', name: { ar: 'ميلو باشن', en: 'Melo Passion' }, variants: one(4), displayOrder: 1, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  { id: 'volcano-smash', category: 'cocktail', name: { ar: 'فلكانو سماش', en: 'Volcano Smash' }, variants: one(4), displayOrder: 2, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  { id: 'mango-lassi', category: 'cocktail', name: { ar: 'مانجو لاسي', en: 'Mango Lassi' }, variants: one(4), displayOrder: 3, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  { id: 'mix-berry', category: 'cocktail', name: { ar: 'مكس بيري', en: 'Mix Berry' }, variants: one(4), displayOrder: 4, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  { id: 'mango-passion-fruit', category: 'cocktail', name: { ar: 'مانجا باشن فروت', en: 'Mango Passion Fruit' }, variants: one(3), displayOrder: 5, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  { id: 'pina-colade', category: 'cocktail', name: { ar: 'بينا كولادا', en: 'Pina Colade' }, variants: one(3), displayOrder: 6, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  { id: 'banana-with-milk', category: 'cocktail', name: { ar: 'موز مع حليب', en: 'Banana with Milk' }, variants: one(2.5), displayOrder: 7, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  { id: 'alshaeab-cocktail', category: 'cocktail', name: { ar: 'كوكتيل الشعب', en: 'Alshaeab Cocktail' }, variants: one(4), displayOrder: 8, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },

  // ── Fresh Juice / عصير طبيعي ─────────────────────────────────────────────
  {
    id: 'fresh-juice', category: 'fruit-juice',
    name: { ar: 'عصير طبيعي', en: 'Fresh Juice' },
    description: { ar: 'برتقال / فراولة / مانجا / جزر / كيوي / تفاح / جوافة / ليمون / ليمون ونعنع / كيوي و ليمون / جوافة ونعنع', en: 'Orange / Strawberry / Mango / Carrot / Kiwi / Apple / Guava / Lemon / Lemon & Mint / Kiwi & Lemon / Guava & Mint' },
    options: [
      { ar: 'برتقال', en: 'Orange' },
      { ar: 'فراولة', en: 'Strawberry' },
      { ar: 'مانجا', en: 'Mango' },
      { ar: 'جزر', en: 'Carrot' },
      { ar: 'كيوي', en: 'Kiwi' },
      { ar: 'تفاح', en: 'Apple' },
      { ar: 'جوافة', en: 'Guava' },
      { ar: 'ليمون', en: 'Lemon' },
      { ar: 'ليمون ونعنع', en: 'Lemon & Mint' },
      { ar: 'كيوي و ليمون', en: 'Kiwi & Lemon' },
      { ar: 'جوافة ونعنع', en: 'Guava & Mint' },
    ],
    variants: one(2.5), displayOrder: 1, available: true, ocrSource: SRC.juices,
    verificationStatus: 'needs_confirmation',
    note: { ar: 'المنيو الورقي يذكر النكهات فقط بدون اسم صنف', en: 'The paper menu lists only the flavours, with no item name' },
  },

  // ── Chiller / شيلر ───────────────────────────────────────────────────────
  { id: 'mojito', category: 'chiller', name: { ar: 'موهيتو', en: 'Mojito' }, variants: one(2.25), displayOrder: 1, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  { id: 'mocktail', category: 'chiller', name: { ar: 'موكتيل', en: 'Mocktail' }, variants: one(3.5), displayOrder: 2, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  { id: 'red-bull', category: 'chiller', name: { ar: 'رد بول', en: 'Red Bull' }, variants: one(2.55), displayOrder: 3, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  {
    id: 'soft-drinks', category: 'chiller',
    name: { ar: 'بيبسي / سيفن اب / ميراندا', en: 'Pepsi / 7 Up / Miranda' },
    options: [
      { ar: 'بيبسي', en: 'Pepsi' },
      { ar: 'سيفن اب', en: '7 Up' },
      { ar: 'ميراندا', en: 'Miranda' },
    ],
    variants: one(0.6), displayOrder: 4, available: true, ocrSource: SRC.juices, verificationStatus: 'verified',
  },
  { id: 'g-drink', category: 'chiller', name: { ar: 'مشروب جي', en: 'G Drink' }, variants: one(1.25), displayOrder: 5, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
  { id: 'mineral-water', category: 'chiller', name: { ar: 'مياة معدنية', en: 'Mineral Water' }, variants: one(0.5), displayOrder: 6, available: true, ocrSource: SRC.juices, verificationStatus: 'verified' },
]
