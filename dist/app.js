import {FLAVORS,SAUCES,TOPPINGS,VESSELS,DEFAULT_CONFIG,flavorById,normalizeConfig,normalizeCart,priceOf,addToCart,cartTotal,escapeHTML as esc} from './model.js';
import {previewLayout,HERO_PRESETS,HERO_ASSETS} from './preview.js';
import {downloadRecipeCard} from './recipe-card.js';
import {t,number as faNumber,money,localFlavor,creationName,describe as describeConfig,getLanguage,setLanguageValue,captureStaticTranslations,applyStaticLanguage} from './i18n.js';
const $=id=>document.getElementById(id);
function readSaved(key,fallback){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback;}catch{return fallback;}}
function persist(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{if($('storage-notice'))$('storage-notice').hidden=false;return false;}}
let config=normalizeConfig(readSaved('scoovia.creation.v1',DEFAULT_CONFIG));
let cart=normalizeCart(readSaved('scoovia.cart.v1',[]));
let activeSlot=0;
let toastTimer;
let filter='all';
let selectedHero='signature';
let heroRequest=0;
const staticTranslations=captureStaticTranslations(document);
setLanguageValue(new URL(location.href).searchParams.get('lang')||readSaved('scoovia.language.v1','fa'));
applyStaticLanguage(staticTranslations,getLanguage());
const flavors=()=>FLAVORS.map(f=>localFlavor(f));
const sprite=f=>`<span class="scoop-sprite sprite-${f.sprite}" aria-hidden="true"></span>`;
function notify(message){clearTimeout(toastTimer);$('toast').textContent=t(message);$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,3500);}
function renderFlavors(){
 const items=flavors().filter(f=>filter==='all'||f.category===filter);
 $('flavor-grid').innerHTML=items.map(f=>`<article class="flavor-card" style="--card-bg:${f.bg}"><button class="flavor-card-image" data-product="${f.id}" aria-label="${esc(t('جزئیات طعم {name}',{name:f.name}))}"><span class="card-tag">${f.tag}</span>${sprite(f)}<span class="card-number" dir="ltr">0${f.sprite+1} / 06</span></button><div class="flavor-card-body"><div class="flavor-card-top"><h3><button data-product="${f.id}">${f.name}</button></h3><span class="flavor-en" dir="ltr">${f.en}</span></div><p>${f.description}</p><div class="flavor-card-bottom"><span class="card-price">${faNumber(f.price)}<small>${t('تومان / اسکوپ')}</small></span><button class="card-add" data-add-flavor="${f.id}" aria-label="${esc(t('افزودن یک اسکوپ {name} در لیوان به سبد',{name:f.name}))}">+</button></div></div></article>`).join('');
 $('flavor-empty').hidden=items.length>0;
}
function toppingMarkup(type){
 if(type==='none')return '';
 const colors=type==='pistachio'?['#688b44','#9cba65','#d1b884']:type==='chocolate'?['#442e28','#664438','#895c42']:['#cf658e','#69a8a0','#efd264','#9272ad'];
 return Array.from({length:18},(_,i)=>`<i class="topping-bit" style="--tx:${12+(i*37)%80}%;--ty:${12+(i*19)%62}%;--tr:${i*23}deg;--tc:${colors[i%colors.length]};--tw:${type==='sprinkles'?3:5+(i%4)}px;--th:${type==='sprinkles'?8:5}px"></i>`).join('');
}
function stackMarkup(c){return c.scoops.map((id,i)=>{const f=flavorById(id);return `<div class="stack-scoop scoop-sprite sprite-${f.sprite}" style="--bottom:${i*63}px;--left:${i%2===0?10:22}px;--z:${i+1}" role="img" aria-label="${esc(t('اسکوپ {name}',{name:localFlavor(f).name}))}"></div>`;}).join('');}
function renderBuilder(animate=false){
 config=normalizeConfig(config);activeSlot=Math.min(activeSlot,config.scoops.length-1);
 $('creation').dataset.count=config.scoops.length;$('creation').dataset.vessel=config.vessel;
 $('cone-vessel').hidden=config.vessel!=='cone';$('cup-vessel').hidden=config.vessel!=='cup';
 $('scoop-stack').innerHTML=stackMarkup(config);
 $('sauce-layer').hidden=config.sauce==='none';$('sauce-layer').style.setProperty('--sauce-color',SAUCES[config.sauce].color);
 const layout=previewLayout(config.vessel,config.scoops.length);
 $('creation').style.setProperty('--stack-bottom',`${layout.stackBottom}px`);
 $('creation').style.setProperty('--sauce-top',`${layout.sauceTop}px`);
 $('topping-layer').hidden=config.topping==='none';$('topping-layer').innerHTML=toppingMarkup(config.topping);
 $('scoop-counter').textContent=t('{n} اسکوپ',{n:faNumber(config.scoops.length)});$('preview-name').textContent=creationName(config);$('preview-description').textContent=describeConfig(config);
 $('builder-price').innerHTML=`${faNumber(priceOf(config))} <span>${t('تومان')}</span>`;
 $('scoop-slots').innerHTML=config.scoops.map((id,i)=>`<div class="slot-group"><button class="scoop-slot ${i===activeSlot?'active':''}" data-slot="${i}" aria-pressed="${i===activeSlot}" style="--swatch:${flavorById(id).color}"><i></i>${t('اسکوپ {n}',{n:faNumber(i+1)})}</button>${config.scoops.length>1?`<button class="slot-remove" data-remove-slot="${i}" aria-label="${t('حذف اسکوپ {n}',{n:faNumber(i+1)})}">${t('حذف')}</button>`:''}</div>`).join('')+(config.scoops.length<3?`<button class="scoop-slot add-slot" id="add-slot" aria-label="${t('افزودن اسکوپ جدید')}">+</button>`:'');
 $('builder-flavors').innerHTML=flavors().map(f=>`<button class="builder-flavor ${config.scoops[activeSlot]===f.id?'active':''}" data-builder-flavor="${f.id}" aria-pressed="${config.scoops[activeSlot]===f.id}">${sprite(f)}<span>${f.name}</span><span>${faNumber(f.price)}</span></button>`).join('');
 document.querySelectorAll('[data-vessel]').forEach(b=>{const selected=b.dataset.vessel===config.vessel;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',selected);});
 $('sauce').value=config.sauce;$('topping').value=config.topping;
 if(document.activeElement!==$('creation-title'))$('creation-title').value=config.name?creationName(config):'';
 persist('scoovia.creation.v1',config);
 if(animate){$('creation').classList.remove('is-changing');void $('creation').offsetWidth;$('creation').classList.add('is-changing');}
}
function changeConfig(changes,animate=true){config={...config,...changes};renderBuilder(animate);}
function addConfig(c){
 const before=cart.reduce((n,item)=>n+item.qty,0);cart=addToCart(cart,c);const after=cart.reduce((n,item)=>n+item.qty,0);renderCart();persist('scoovia.cart.v1',cart);notify(after>before?'به سبدِ خوشحالی اضافه شد.':'سبد به محدودیت تعداد رسیده است.');
}
function renderCart(){
 $('cart-count').textContent=faNumber(cart.reduce((n,item)=>n+item.qty,0));$('cart-trigger').setAttribute('aria-label',t('بازکردن سبد خرید، {n} محصول',{n:faNumber(cart.reduce((n,item)=>n+item.qty,0))}));
 $('cart-total').textContent=money(cartTotal(cart));
 if(!cart.length){$('cart-items').innerHTML=`<div class="cart-empty"><span aria-hidden="true">✳</span><h3>${t('جای یک طعم تازه خالی است.')}</h3><p>${t('ترکیبت را بساز یا از طعم‌ها شروع کن.')}</p><a href="#studio" data-close="cart-dialog">${t('رفتن به استودیو ←')}</a></div>`;return;}
 $('cart-items').innerHTML=cart.map((item,i)=>`<article class="cart-item"><div class="cart-item-visual">${sprite(flavorById(item.config.scoops[0]))}</div><div><h3>${esc(creationName(item.config))}</h3><p>${esc(describeConfig(item.config))}</p><div class="cart-item-controls"><div class="quantity-controls"><button data-qty="${i}" data-delta="1" aria-label="${esc(t('افزایش تعداد {name}',{name:creationName(item.config)}))}" ${item.qty>=20?'disabled':''}>+</button><span>${faNumber(item.qty)}</span><button data-qty="${i}" data-delta="-1" aria-label="${esc(t('کاهش تعداد {name}',{name:creationName(item.config)}))}">−</button></div><span class="cart-item-price">${money(priceOf(item.config)*item.qty)}</span><button class="cart-remove" data-remove-cart="${i}" aria-label="${esc(t('حذف {name} از سبد',{name:creationName(item.config)}))}">${t('حذف')}</button></div></div></article>`).join('');
}
function openDialog(id){const dialog=$(id);if(!dialog.open)dialog.showModal();document.body.classList.add('dialog-open');}
function closeDialog(id){$(id).close();if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');}
function showProduct(id){const raw=flavorById(id);if(!raw)return;const f=localFlavor(raw);$('product-dialog').dataset.flavor=id;$('product-content').innerHTML=`<div class="product-detail" style="--card-bg:${f.bg}"><div class="product-detail-art">${sprite(f)}</div><div class="product-detail-copy"><div class="eyebrow" dir="ltr">FLAVOR / 0${f.sprite+1}</div><h2 id="product-title">${f.name}</h2><span class="flavor-en" dir="ltr">${f.en}</span><p>${f.story}</p><dl class="product-meta"><div><dt>${t('شیرینی')}</dt><dd>${f.sweetness}</dd></div><div><dt>${t('بافت')}</dt><dd>${f.texture}</dd></div><div><dt>${t('حساسیت‌زا')}</dt><dd>${f.allergens}</dd></div></dl><strong>${money(f.price)}</strong><span class="demo-prices">${t('قیمت و اطلاعات نمونه · هر اسکوپ')}</span><button class="button button-dark" data-use-flavor="${f.id}">${t('با این طعم می‌سازم')} <span aria-hidden="true">←</span></button></div></div>`;openDialog('product-dialog');}
function paintHeroChrome(key){
 const preset=HERO_PRESETS[key];
 document.querySelectorAll('[data-hero]').forEach(button=>{const active=button.dataset.hero===key;button.classList.toggle('active',active);button.setAttribute('aria-pressed',active);});
 const art=document.querySelector('.hero-art');art.setAttribute('aria-label',describeConfig(preset));art.style.setProperty('--hero-bg',{signature:'#d4dfb5',berry:'#e5d5e9',chocolate:'#e7d5c2'}[key]);
 document.querySelector('.note-one').textContent=t(key==='signature'?'یک اسکوپ خیال':key==='berry'?'یک رؤیای میوه‌ای':'کاکائویی و پررنگ');
 $('hero-product').alt=describeConfig(preset);
}
let displayedHero='signature';
async function renderHero(key,animate=true){
 if(!Object.hasOwn(HERO_ASSETS,key))return;
 selectedHero=key;const request=++heroRequest;const art=document.querySelector('.hero-art');const product=$('hero-product');const source=HERO_ASSETS[key];
 paintHeroChrome(key);art.setAttribute('aria-busy','true');
 try{
  if(product.getAttribute('src')!==source){
   await new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src=source;});
   if(request!==heroRequest)return;product.src=source;
  }
  if(request!==heroRequest)return;displayedHero=key;
  if(animate){art.classList.remove('is-changing');void art.offsetWidth;art.classList.add('is-changing');}
 }catch{if(request===heroRequest){selectedHero=displayedHero;paintHeroChrome(displayedHero);notify('تصویر ترکیب آماده نشد؛ دوباره امتحان کن.');}}
 finally{if(request===heroRequest)art.setAttribute('aria-busy','false');}
}
function surprise(){
 const count=2+Math.round(Math.random());const scoops=Array.from({length:count},()=>FLAVORS[Math.floor(Math.random()*FLAVORS.length)].id);
 const names=['یک عصرِ بنفش','پیچِ خوشحالی','ترکیبِ غیرمنتظره','کمی آفتاب','حالِ خوبِ امروز'];
 activeSlot=0;changeConfig({vessel:Math.random()>.5?'cone':'cup',scoops,sauce:['none','chocolate','berry','caramel'][Math.floor(Math.random()*4)],topping:['none','pistachio','chocolate','sprinkles'][Math.floor(Math.random()*4)],name:names[Math.floor(Math.random()*names.length)]});notify('یک ترکیب تازه! می‌توانی هر بخشش را تغییر بدهی.');
}
async function downloadCard(){
 const button=$('share-creation');button.disabled=true;
 try{
  await downloadRecipeCard(normalizeConfig(config),getLanguage());notify('کارت PNG ترکیبت آماده شد.');
 }catch{notify('کارت آماده نشد؛ دوباره امتحان کن.');}finally{button.disabled=false;}
}
document.addEventListener('click',event=>{
 const button=event.target.closest('button,a');if(!button)return;
 if(button.dataset.product)showProduct(button.dataset.product);
 if(button.dataset.addFlavor){const f=flavorById(button.dataset.addFlavor);if(f)addConfig({vessel:'cup',scoops:[f.id],sauce:'none',topping:'none',name:flavorById(f.id).name});}
 if(button.dataset.filter){filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button);});renderFlavors();}
 if(button.dataset.vessel)changeConfig({vessel:button.dataset.vessel});
 if(button.dataset.slot!==undefined){activeSlot=Number(button.dataset.slot);renderBuilder();$('builder-flavors').querySelector('.active')?.focus({preventScroll:true});}
 if(button.dataset.removeSlot!==undefined){const index=Number(button.dataset.removeSlot);if(config.scoops.length>1){config.scoops.splice(index,1);if(activeSlot>=index)activeSlot=Math.max(0,activeSlot-1);renderBuilder(true);$('scoop-slots').querySelector('.active')?.focus({preventScroll:true});}}
 if(button.id==='add-slot'&&config.scoops.length<3){config.scoops.push('vanilla');activeSlot=config.scoops.length-1;renderBuilder(true);$('builder-flavors').querySelector('.active')?.focus({preventScroll:true});}
 if(button.dataset.builderFlavor){config.scoops[activeSlot]=button.dataset.builderFlavor;renderBuilder(true);$('builder-flavors').querySelector('.active')?.focus({preventScroll:true});}
 if(button.dataset.hero)renderHero(button.dataset.hero);
 if(button.hasAttribute('data-start-hero')){activeSlot=0;changeConfig(HERO_PRESETS[selectedHero]);notify('این ترکیب آمادهٔ تغییر به سلیقهٔ توست.');}
 if(button.dataset.close)closeDialog(button.dataset.close);
 if(button.dataset.useFlavor){activeSlot=0;changeConfig({scoops:[button.dataset.useFlavor],sauce:'none',topping:'none',name:''});closeDialog('product-dialog');location.hash='studio';$('creation-title').focus({preventScroll:true});}
 if(button.dataset.qty!==undefined){const i=Number(button.dataset.qty);if(!cart[i])return;cart[i].qty=Math.min(20,cart[i].qty+Number(button.dataset.delta));if(cart[i].qty<=0)cart.splice(i,1);renderCart();persist('scoovia.cart.v1',cart);const remaining=$('cart-items').querySelector(`[data-qty="${Math.min(i,cart.length-1)}"][data-delta="${button.dataset.delta}"]`);const focusTarget=remaining?.disabled?$('cart-items').querySelector(`[data-qty="${i}"][data-delta="-1"]`):remaining;(focusTarget||$('cart-dialog').querySelector('.dialog-close')).focus({preventScroll:true});}
 if(button.dataset.removeCart!==undefined){const i=Number(button.dataset.removeCart);cart.splice(i,1);renderCart();persist('scoovia.cart.v1',cart);notify('از سبد حذف شد.');($('cart-items').querySelector(`[data-remove-cart="${Math.min(i,cart.length-1)}"]`)||$('cart-dialog').querySelector('.dialog-close')).focus({preventScroll:true});}
});
$('sauce').addEventListener('change',e=>changeConfig({sauce:e.target.value}));$('topping').addEventListener('change',e=>changeConfig({topping:e.target.value}));
$('creation-title').addEventListener('input',e=>{config.name=e.target.value.trim().slice(0,32);$('preview-name').textContent=creationName(config);persist('scoovia.creation.v1',normalizeConfig(config));});
$('surprise').addEventListener('click',surprise);$('add-creation').addEventListener('click',()=>addConfig(config));$('share-creation').addEventListener('click',downloadCard);$('cart-trigger').addEventListener('click',()=>{renderCart();openDialog('cart-dialog');});
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');});d.addEventListener('click',e=>{const rect=d.getBoundingClientRect();if(e.target===d&&(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom))closeDialog(d.id);});});
$('menu-toggle').addEventListener('click',()=>{const open=$('menu-toggle').getAttribute('aria-expanded')==='true';$('menu-toggle').setAttribute('aria-expanded',!open);$('menu-toggle').setAttribute('aria-label',open?t('بازکردن منو'):t('بستن منو'));$('mobile-nav').hidden=open;});
$('mobile-nav').addEventListener('click',e=>{if(e.target.closest('a')){$('mobile-nav').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false');$('menu-toggle').setAttribute('aria-label',t('بازکردن منو'));}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('mobile-nav').hidden){$('mobile-nav').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false');$('menu-toggle').setAttribute('aria-label',t('بازکردن منو'));$('menu-toggle').focus();}});
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));
document.querySelector('.hero-art').addEventListener('animationend',e=>{if(e.target.matches('.hero-product,.hero-alternate'))e.currentTarget.classList.remove('is-changing');});
$('creation').addEventListener('animationend',()=> $('creation').classList.remove('is-changing'));
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let motionChoice=readSaved('scoovia.motion.v1',null);
function setMotion(paused){const effective=paused||reducedMotion.matches;document.body.classList.toggle('motion-paused',effective);$('motion-toggle').disabled=reducedMotion.matches;$('motion-toggle').setAttribute('aria-pressed',effective);$('motion-toggle').setAttribute('aria-label',reducedMotion.matches?t('حرکت‌ها طبق تنظیمات دستگاه غیرفعال‌اند'):effective?t('فعال‌کردن حرکت‌ها'):t('تثبیت حرکت‌ها'));}
setMotion(typeof motionChoice==='boolean'?motionChoice:reducedMotion.matches);
$('motion-toggle').addEventListener('click',()=>{motionChoice=!document.body.classList.contains('motion-paused');setMotion(motionChoice);persist('scoovia.motion.v1',motionChoice);});
reducedMotion.addEventListener('change',e=>setMotion(typeof motionChoice==='boolean'?motionChoice:e.matches));
function applyLanguage(language){
 const lang=setLanguageValue(language);applyStaticLanguage(staticTranslations,lang);
 document.documentElement.lang=lang;document.documentElement.dir=lang==='en'?'ltr':'rtl';
 $('language-toggle').textContent=lang==='en'?'فارسی':'EN';$('language-toggle').lang=lang==='en'?'fa':'en';$('language-toggle').setAttribute('aria-label',lang==='en'?'Switch to Persian':'Switch to English');
 const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(history.state,'',url);
 persist('scoovia.language.v1',lang);renderFlavors();renderBuilder();renderCart();renderHero(selectedHero,false);
 setMotion(typeof motionChoice==='boolean'?motionChoice:reducedMotion.matches);
 $('menu-toggle').setAttribute('aria-label',t($('mobile-nav').hidden?'بازکردن منو':'بستن منو'));
 if($('product-dialog').open)showProduct($('product-dialog').dataset.flavor);
 $('toast').hidden=true;
}
$('language-toggle').addEventListener('click',()=>applyLanguage(getLanguage()==='fa'?'en':'fa'));
applyLanguage(getLanguage());
const preloadHero=()=>Object.values(HERO_ASSETS).forEach(source=>{const image=new Image();image.src=source;});
if('requestIdleCallback' in window)requestIdleCallback(preloadHero,{timeout:3000});else setTimeout(preloadHero,2000);
