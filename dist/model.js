export const FLAVORS = [
 {id:'pistachio',name:'پسته',en:'Pistachio daydream',category:'nut',tag:'آجیلی',price:85000,color:'#c2d59b',bg:'#e7ebd8',sprite:0,description:'ملایم و خامه‌ای، با یک پیچِ پسته‌ای.',story:'یک شروع آرام با رنگ سبز پسته‌ای؛ کنار وانیل کلاسیک می‌شود، کنار بلوبری یک تجربهٔ تازه.',sweetness:'ملایم',texture:'خامه‌ای',allergens:'نمونه: شیر، پسته'},
 {id:'blueberry',name:'بلوبری',en:'Violet little dream',category:'fruit',tag:'میوه‌ای',price:70000,color:'#c8a7da',bg:'#e8deef',sprite:1,description:'بنفش، میوه‌ای، کمی خارج از معمول.',story:'یک حال‌وهوای بنفش با مزهٔ میوه‌ای. با پسته امتحانش کن یا برای یک ترکیب روشن، وانیل کنارش بگذار.',sweetness:'متوسط',texture:'خامه‌ای و میوه‌ای',allergens:'نمونه: شیر'},
 {id:'strawberry',name:'توت‌فرنگی',en:'Pink kind of happy',category:'fruit',tag:'میوه‌ای',price:65000,color:'#eaa6b6',bg:'#f2dddd',sprite:2,description:'یک اسکوپ صورتی برای روزهای دلخواه.',story:'رنگ صورتی و یک انتخاب میوه‌ای آشنا. ترکیب توت‌فرنگی، وانیل و سس شکلات را در استودیو امتحان کن.',sweetness:'متوسط',texture:'خامه‌ای با تکه‌های میوه',allergens:'نمونه: شیر'},
 {id:'vanilla',name:'وانیل',en:'The quiet classic',category:'classic',tag:'کلاسیک',price:60000,color:'#e4d4a7',bg:'#ece7d8',sprite:3,description:'ساده، نرم، آمادهٔ هزار ترکیب تازه.',story:'جایی که ترکیب‌های خوب شروع می‌شوند. وانیل می‌تواند کنار هر طعمی بنشیند و با سس دلخواهت کامل شود.',sweetness:'متوسط',texture:'نرم و خامه‌ای',allergens:'نمونه: شیر'},
 {id:'chocolate',name:'شکلات',en:'For the cocoa people',category:'classic',tag:'کلاسیک',price:75000,color:'#9a6c50',bg:'#e6dacf',sprite:4,description:'کاکائویی و پررنگ، مخصوص شکلات‌بازها.',story:'برای وقتی که یک اسکوپ شکلات کافی نیست. با سس شکلات و خرده‌شکلات، ترکیب مخصوص شکلات‌بازها را بساز.',sweetness:'متوسط',texture:'خامه‌ای با تکه‌های شکلات',allergens:'نمونه: شیر؛ ترکیبات شکلات بررسی شود'},
 {id:'mango',name:'انبه',en:'A spoonful of sunshine',category:'fruit',tag:'میوه‌ای',price:70000,color:'#edbd4d',bg:'#f2e5c8',sprite:5,description:'طلایی و میوه‌ای؛ یک پیچِ آفتابی.',story:'یک انتخاب طلایی با حال‌وهوای میوه‌ای. کنار توت‌فرنگی رنگی‌تر می‌شود؛ کنار بلوبری غیرمنتظره‌تر.',sweetness:'میوه‌ای',texture:'سوربت',allergens:'نمونه: دستور تهیه و آلودگی متقاطع بررسی شود'}
];
export const SAUCES={none:{name:'بدون سس',price:0,color:'transparent'},chocolate:{name:'سس شکلات',price:15000,color:'#654032'},berry:{name:'سس توت‌فرنگی',price:15000,color:'#b95575'},caramel:{name:'سس کارامل',price:15000,color:'#bd8038'}};
export const TOPPINGS={none:{name:'بدون تاپینگ',price:0},pistachio:{name:'خردهٔ پسته',price:20000},chocolate:{name:'شکلات خردشده',price:20000},sprinkles:{name:'اسپرینکل رنگی',price:20000}};
export const VESSELS={cone:{name:'قیف وافلی',price:10000},cup:{name:'لیوان',price:0}};
export const DEFAULT_CONFIG={vessel:'cone',scoops:['pistachio','blueberry'],sauce:'none',topping:'none',name:''};
export const flavorById=id=>FLAVORS.find(f=>f.id===id);
export function normalizeConfig(raw){
 const value=raw&&typeof raw==='object'?raw:{};
 const scoops=Array.isArray(value.scoops)?value.scoops.filter(id=>typeof id==='string'&&flavorById(id)).slice(0,3):[];
 const choice=(table,key,fallback)=>typeof key==='string'&&Object.hasOwn(table,key)?key:fallback;
 return {vessel:choice(VESSELS,value.vessel,'cone'),scoops:scoops.length?scoops:[...DEFAULT_CONFIG.scoops],sauce:choice(SAUCES,value.sauce,'none'),topping:choice(TOPPINGS,value.topping,'none'),name:typeof value.name==='string'?value.name.replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,32):''};
}
export function priceOf(config){const c=normalizeConfig(config);return c.scoops.reduce((sum,id)=>sum+flavorById(id).price,0)+VESSELS[c.vessel].price+SAUCES[c.sauce].price+TOPPINGS[c.topping].price;}
export function describeConfig(config){const c=normalizeConfig(config);return c.scoops.map(id=>flavorById(id).name).join(' و ')+' در '+VESSELS[c.vessel].name+(c.sauce!=='none'?'، '+SAUCES[c.sauce].name:'')+(c.topping!=='none'?'، '+TOPPINGS[c.topping].name:'');}
export function configKey(config){return JSON.stringify(normalizeConfig(config));}
export function normalizeCart(raw){if(!Array.isArray(raw))return [];return raw.filter(item=>item&&typeof item==='object'&&Array.isArray(item.config?.scoops)&&item.config.scoops.some(id=>typeof id==='string'&&flavorById(id))).slice(0,40).map(item=>({config:normalizeConfig(item.config),qty:Math.min(20,Math.max(1,Number.isInteger(item.qty)?item.qty:1))}));}
export function addToCart(cart,config){const list=normalizeCart(cart);const c=normalizeConfig(config);const key=configKey(c);const found=list.find(item=>configKey(item.config)===key);if(found)found.qty=Math.min(20,found.qty+1);else if(list.length<40)list.push({config:c,qty:1});return list;}
export const cartTotal=cart=>normalizeCart(cart).reduce((sum,item)=>sum+priceOf(item.config)*item.qty,0);
export const faNumber=value=>new Intl.NumberFormat('fa-IR').format(value);
export const money=value=>faNumber(value)+' تومان';
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
