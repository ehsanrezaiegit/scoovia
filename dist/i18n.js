import {normalizeConfig,flavorById,SAUCES,TOPPINGS,VESSELS} from './model.js';

export const STATIC_EN={
 'SCOOVIA | طعمِ خودت را بساز':'SCOOVIA | Make it your flavor',
 'اسکوویا، استودیوی تعاملی بستنی. طعم‌ها را کشف کن و ترکیب مخصوص خودت را بساز.':'SCOOVIA, an interactive ice cream studio. Discover the flavors and create your own combination.',
 'SCOOVIA — طعمِ خودت را بساز':'SCOOVIA — Make it your flavor',
 'یک قیف. هزار احتمال. وارد استودیوی طعم شو.':'One cone. Endless possibilities. Step into the flavor studio.',
 'رفتن به محتوای اصلی':'Skip to main content','کمی کنجکاوی، یک عالمه طعم':'A little curiosity. A whole lot of flavor.','استودیوی نمایشی اسکوویا':'SCOOVIA concept studio',
 'اسکوویا، خانه':'SCOOVIA, home','منوی اصلی':'Main navigation','طعم‌ها':'Flavors','استودیوی تو':'Your studio','جدید':'New','قصهٔ اسکوویا':'Our story','سبد':'Bag','منوی موبایل':'Mobile navigation',
 'تثبیت حرکت‌ها':'Pause animations','فعال‌کردن حرکت‌ها':'Resume animations','حرکت‌ها طبق تنظیمات دستگاه غیرفعال‌اند':'Animations are off according to your device settings',
 'بازکردن منو':'Open menu','بستن منو':'Close menu','بازکردن سبد خرید':'Open shopping bag',
 'خوشحالی،':'Happiness,','به طعمِ':'made','خودت':'yours.',
 'یک اسکوپ پسته، کمی خیال، یک پیچِ تازه.':'A scoop of pistachio, a little imagination, a fresh twist.',
 'اینجا هر ترکیب، قصهٔ خودش را دارد.':'Every combination has a story of its own.',
 'با این ترکیب می‌سازم':'Make this one mine','اول طعم‌ها را ببینم':'Explore the flavors','از انتخاب اولین اسکوپ':'From your very first scoop','تا ترکیبی که فقط مال توست.':'to a combination that is all yours.',
 'بستنی سه اسکوپ با طعم پسته، بلوبری و وانیل':'Three-scoop pistachio, blueberry and vanilla ice cream',
 'قیف وافلی با سه اسکوپ بستنی پسته، بلوبری و وانیل':'Waffle cone with pistachio, blueberry and vanilla ice cream',
 'یک اسکوپ خیال':'A scoop of imagination','کمی بیشتر از معمول!':'A little beyond ordinary!','با سلیقهٔ تو':'Made your way',
 'پیش‌نمایش ترکیب‌های پیشنهادی':'Preview suggested combinations','پسته و خیال':'Pistachio Daydream','رویای بنفش':'Violet Dream','شکلات‌باز':'Cocoa Lover',
 'خوشمزه‌تر می‌شود':'More goodness below','یک قیف، هزار احتمال':'One cone, endless possibilities','به سلیقهٔ خودت':'Make it your own',
 'از کدام طعم شروع کنیم؟':'Where will your flavor story begin?','شش طعم، شش حال‌وهوا.':'Six flavors. Six moods.','بقیه‌اش را تو تعریف می‌کنی.':'The rest is up to you.',
 'فیلتر طعم‌ها':'Filter flavors','همهٔ طعم‌ها':'All flavors','میوه‌ای':'Fruity','کلاسیک':'Classic','آجیلی':'Nutty','قیمت‌های نمونه · تومان':'Sample prices · toman','طعمی برای این دسته پیدا نشد.':'No flavors found in this category.',
 'حالا نوبتِ سلیقهٔ توست.':'Now, a little experiment of your own.','انتخاب کن. ترکیب کن. اسمش را بگذار.':'Choose it. Mix it. Give it a name.','این یکی، امضای تو را دارد.':'This one has your signature.',
 '۲ اسکوپ':'2 scoops','معرفی می‌کنیم:':'Introducing:','ترکیبِ من':'My creation','پسته و بلوبری در قیف وافلی':'Pistachio + blueberry in a waffle cone','غافلگیرم کن!':'Surprise me!',
 'قیف یا لیوان؟':'Cone or cup?','انتخاب ظرف':'Choose a vessel','قیف وافلی':'Waffle cone','کلاسیک و ترد':'Classic & crisp','لیوان':'Cup','ساده و راحت':'Simple & easy',
 'اسکوپ‌هایت را بچین':'Pick your scoops','۱ تا ۳ اسکوپ':'1 to 3 scoops','انتخاب طعم اسکوپ':'Choose scoop flavor','روی اسکوپ انتخاب‌شده بزن تا طعمش را عوض کنی.':'Select a scoop, then choose a different flavor below.',
 'کمی سس؟':'A little sauce?','بدون سس':'No sauce','شکلات · ۱۵٬۰۰۰':'Chocolate · 15,000','توت‌فرنگی · ۱۵٬۰۰۰':'Strawberry · 15,000','کارامل · ۱۵٬۰۰۰':'Caramel · 15,000',
 'و یک تاپینگ':'And a topping','بدون تاپینگ':'No topping','خردهٔ پسته · ۲۰٬۰۰۰':'Pistachio pieces · 20,000','شکلات خردشده · ۲۰٬۰۰۰':'Chocolate pieces · 20,000','اسپرینکل رنگی · ۲۰٬۰۰۰':'Rainbow sprinkles · 20,000',
 'اسم ترکیبت را چه می‌گذاری؟':'What will you call your creation?','مثلاً: یک عصرِ بنفش':'e.g. A violet afternoon','قیمت نمونهٔ ترکیب تو':'Sample price for your creation','تومان':'toman','اضافه به سبد':'Add to bag','دریافت کارت ترکیب من · PNG':'Download my flavor card · PNG',
 'ذخیرهٔ خودکار در این مرورگر در دسترس نیست؛ قبل از خروج کارتت را دریافت کن.':'Auto-save is unavailable in this browser. Download your card before leaving.',
 'این یک تجربهٔ نمایشی است؛ سفارش و پرداخت فعال نیست.':'A concept experience. Ordering and payments are not enabled.',
 'اسکوپ توت‌فرنگی':'Strawberry ice cream scoop','چیزی که دوست داری،':'Something you love,','با یک پیچ تازه.':'with a fresh twist.',
 'بستنی جدی است.':'Ice cream is serious.','انتخابش، بازی.':'Choosing it is play.',
 'اسکوویا از یک سؤال ساده شروع می‌شود: اگر بستنی دقیقاً شبیه حال‌وهوای امروزت باشد، چه شکلی می‌شود؟':'SCOOVIA begins with a simple question: if your ice cream matched today’s mood, what would it look like?',
 'ما طعم‌ها را روی میز می‌گذاریم. تو ترکیبشان می‌کنی. گاهی کلاسیک، گاهی عجیب، همیشه به سلیقهٔ خودت.':'We bring the flavors. You put them together. Sometimes classic, sometimes unexpected, always your own.',
 'قصهٔ خودم را می‌سازم':'Create my own story','قبل از اولین اسکوپ':'Before your first scoop','می‌توانم اینجا سفارش بدهم؟':'Can I place an order here?',
 'این نسخه برای تجربه و بررسی طراحی ساخته شده است. ترکیب‌ها و سبد روی همین دستگاه ذخیره می‌شوند؛ سفارشی ارسال نمی‌شود و پرداخت فعال نیست.':'This version is a design concept. Creations and your bag are saved on this device; no order is submitted and payment is disabled.',
 'ترکیبم را چطور ذخیره کنم؟':'How do I save my creation?',
 'ترکیب فعلی به‌صورت خودکار در مرورگرت ذخیره می‌شود. با «دریافت کارت ترکیب من · PNG» یک کارت تصویری هم دریافت می‌کنی که می‌توانی نگه داری یا به اشتراک بگذاری.':'Your current creation is saved automatically in your browser. Download your PNG flavor card to keep it or share it.',
 'دربارهٔ مواد حساسیت‌زا چه بدانم؟':'What about allergens?',
 'اطلاعات محصولات و قیمت‌ها در این نسخه نمونه هستند. قبل از فروش واقعی، مواد تشکیل‌دهنده و حساسیت‌زا باید با دستور تهیهٔ نهایی بررسی شوند.':'Product information and prices are illustrative. Ingredients and allergens must be verified against the final recipes before real sales begin.',
 'امروز، چه طعمی هستی؟':'What flavor are you today?','کشفش کن':'Find your flavor','اسکوویا · استودیوی طعم':'SCOOVIA · Flavor studio','نسخهٔ مفهومی ۰۳ · ۲۰۲۶':'Concept 03 · 2026','بازگشت به بالا ↑':'Back to top ↑',
 'بستن جزئیات محصول':'Close product details','سبدِ خوشحالی':'Your little bag of joy','بستن سبد خرید':'Close shopping bag','جمع قیمت نمونه':'Sample total','۰ تومان':'0 toman',
 'نسخهٔ نمایشی — پرداخت و ارسال سفارش فعال نیست.':'Concept only — payment and order submission are disabled.','ادامهٔ کشف طعم‌ها':'Keep exploring',
 'با ما در تماس باش':'Let’s talk','ایمیل':'Email','واتس‌اپ':'WhatsApp','یک سؤال یا یک ایدهٔ تازه؟':'A question or a fresh idea?','راه‌های تماس':'Contact links',
 'جزئیات طعم {name}':'Details for {name}','افزودن یک اسکوپ {name} در لیوان به سبد':'Add one scoop of {name} in a cup to your bag','تومان / اسکوپ':'toman / scoop',
 'اسکوپ {name}':'{name} scoop','{n} اسکوپ':'{n} scoops','اسکوپ {n}':'Scoop {n}','حذف اسکوپ {n}':'Remove scoop {n}','حذف':'Remove','افزودن اسکوپ جدید':'Add another scoop',
 'به سبدِ خوشحالی اضافه شد.':'Added to your bag of joy.','سبد به محدودیت تعداد رسیده است.':'Your bag has reached its quantity limit.',
 'بازکردن سبد خرید، {n} محصول':'Open shopping bag, {n} items','جای یک طعم تازه خالی است.':'There’s room for a new flavor.','ترکیبت را بساز یا از طعم‌ها شروع کن.':'Create your own or start with a favorite.','رفتن به استودیو ←':'Go to the studio →',
 'افزایش تعداد {name}':'Increase quantity of {name}','کاهش تعداد {name}':'Decrease quantity of {name}','حذف {name} از سبد':'Remove {name} from your bag','ترکیب':'Creation',
 'شیرینی':'Sweetness','بافت':'Texture','حساسیت‌زا':'Allergens','قیمت و اطلاعات نمونه · هر اسکوپ':'Sample price and information · per scoop','با این طعم می‌سازم':'Start with this flavor',
 'یک رؤیای میوه‌ای':'A fruity little dream','کاکائویی و پررنگ':'Deeply cocoa','یک ترکیب تازه! می‌توانی هر بخشش را تغییر بدهی.':'A fresh combination! You can change any part of it.',
 'یک عصرِ بنفش':'A violet afternoon','پیچِ خوشحالی':'A twist of joy','ترکیبِ غیرمنتظره':'An unexpected scoop','کمی آفتاب':'A little sunshine','حالِ خوبِ امروز':'Today’s good mood',
 'کارت PNG ترکیبت آماده شد.':'Your PNG flavor card is ready.','کارت آماده نشد؛ دوباره امتحان کن.':'The card could not be created. Please try again.','این ترکیب آمادهٔ تغییر به سلیقهٔ توست.':'This combination is ready for your own twist.','از سبد حذف شد.':'Removed from your bag.',
 'تصویر ترکیب آماده نشد؛ دوباره امتحان کن.':'The preview image could not load. Please try again.','یک قیف، هزار احتمال.':'One cone, endless possibilities.',
 '۱':'1','۲':'2','۳':'3','۰':'0','۱۶۵٬۰۰۰':'165,000'
};

export const FLAVOR_EN={
 pistachio:{name:'Pistachio',tag:'Nutty',description:'Soft and creamy, with a pistachio twist.',story:'A gentle green beginning. Pair it with vanilla for a classic, or blueberry for something unexpected.',sweetness:'Gentle',texture:'Creamy',allergens:'Example: milk, pistachio'},
 blueberry:{name:'Blueberry',tag:'Fruity',description:'Violet, fruity, a little out of the ordinary.',story:'A violet mood with a fruity character. Try it with pistachio, or add vanilla for a lighter combination.',sweetness:'Medium',texture:'Creamy and fruity',allergens:'Example: milk'},
 strawberry:{name:'Strawberry',tag:'Fruity',description:'A little pink scoop for your kind of day.',story:'A familiar fruity favorite in pink. Try strawberry, vanilla and chocolate sauce in the studio.',sweetness:'Medium',texture:'Creamy with fruit pieces',allergens:'Example: milk'},
 vanilla:{name:'Vanilla',tag:'Classic',description:'Simple, soft, open to endless possibilities.',story:'Where good combinations begin. Vanilla pairs with any flavor and your favorite sauce.',sweetness:'Medium',texture:'Soft and creamy',allergens:'Example: milk'},
 chocolate:{name:'Chocolate',tag:'Classic',description:'Deeply cocoa, for the chocolate people.',story:'For when one chocolate scoop is not enough. Add chocolate sauce and pieces for a cocoa lover’s creation.',sweetness:'Medium',texture:'Creamy with chocolate pieces',allergens:'Example: milk; verify chocolate ingredients'},
 mango:{name:'Mango',tag:'Fruity',description:'Golden and fruity. A little sunshine.',story:'A golden scoop with a fruity mood. Add strawberry for more color, or blueberry for an unexpected pairing.',sweetness:'Fruity',texture:'Sorbet',allergens:'Example: verify recipe and cross-contact'}
};
const CHOICE_EN={vessel:{cone:'Waffle cone',cup:'Cup'},sauce:{none:'No sauce',chocolate:'Chocolate sauce',berry:'Strawberry sauce',caramel:'Caramel sauce'},topping:{none:'No topping',pistachio:'Pistachio pieces',chocolate:'Chocolate pieces',sprinkles:'Rainbow sprinkles'}};
let currentLanguage='fa';
export const getLanguage=()=>currentLanguage;
export function setLanguageValue(language){currentLanguage=language==='en'?'en':'fa';return currentLanguage;}
export function translate(value,language=currentLanguage){return language==='en'&&Object.hasOwn(STATIC_EN,value)?STATIC_EN[value]:value;}
export function t(value,params={},language=currentLanguage){return translate(value,language).replace(/\{(\w+)\}/g,(_,key)=>String(params[key]??`{${key}}`));}
export const number=(value,language=currentLanguage)=>new Intl.NumberFormat(language==='en'?'en-US':'fa-IR').format(value);
export const money=(value,language=currentLanguage)=>number(value,language)+' '+translate('تومان',language);
export const localFlavor=(flavor,language=currentLanguage)=>language==='en'?{...flavor,...FLAVOR_EN[flavor.id]}:flavor;
export function choiceText(kind,id,language=currentLanguage){return language==='en'?CHOICE_EN[kind][id]:({vessel:VESSELS,sauce:SAUCES,topping:TOPPINGS}[kind][id].name);}
export function creationName(config,language=currentLanguage){
 if(!config.name)return translate('ترکیبِ من',language);
 const match=Object.entries(FLAVOR_EN).find(([id,en])=>flavorById(id).name===config.name||en.name===config.name);
 if(match)return language==='en'?match[1].name:flavorById(match[0]).name;
 return translate(config.name,language);
}
export function describe(config,language=currentLanguage){const c=normalizeConfig(config);return c.scoops.map(id=>localFlavor(flavorById(id),language).name).join(language==='en'?' + ':' و ')+(language==='en'?' in a ':' در ')+choiceText('vessel',c.vessel,language).toLowerCase()+(c.sauce!=='none'?(language==='en'?', ':'، ')+choiceText('sauce',c.sauce,language):'')+(c.topping!=='none'?(language==='en'?', ':'، ')+choiceText('topping',c.topping,language):'');}

export function captureStaticTranslations(root){
 const doc=root.ownerDocument||root;const snapshots=[];
 const walker=doc.createTreeWalker(root,4);let node;
 while((node=walker.nextNode())){if(node.parentElement?.closest('script,style'))continue;const original=node.textContent;const key=original.trim();if(Object.hasOwn(STATIC_EN,key))snapshots.push({node,original,key});}
 root.querySelectorAll('*').forEach(node=>{for(const attribute of ['aria-label','placeholder','alt','title','content']){const original=node.getAttribute(attribute);if(original&&Object.hasOwn(STATIC_EN,original))snapshots.push({node,attribute,original,key:original});}});
 return snapshots;
}
export function applyStaticLanguage(snapshots,language){for(const {node,attribute,original,key} of snapshots){if(!node.isConnected)continue;const value=original.replace(key,translate(key,language));if(attribute)node.setAttribute(attribute,value);else node.textContent=value;}}
