import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {STATIC_EN,translate,t,setLanguageValue,getLanguage,localFlavor,creationName,describe,money,number,applyStaticLanguage} from '../dist/i18n.js';
import {FLAVORS,normalizeConfig,priceOf,cartTotal,flavorById,escapeHTML} from '../dist/model.js';
import {HERO_PRESETS,HERO_ASSETS} from '../dist/preview.js';
const persian=/[\u0600-\u06ff]/;
test('every Persian static text and accessibility label has an English translation',()=>{
 const html=fs.readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 const strings=[...html.matchAll(/>([^<]*)</g)].map(m=>m[1].trim()).concat([...html.matchAll(/(?:aria-label|placeholder|alt|content)="([^"]+)"/g)].map(m=>m[1]));
 const missing=[...new Set(strings.filter(s=>persian.test(s)&&!Object.hasOwn(STATIC_EN,s)))];
 assert.deepEqual(missing,[]);
});
test('all product descriptions and details are localized, while price values remain identical',()=>{
 for(const f of FLAVORS){const localized=localFlavor(f,'en');for(const key of ['name','tag','description','story','sweetness','texture','allergens'])assert.ok(!persian.test(localized[key]),`${f.id}.${key}`);assert.equal(localized.price,f.price);assert.equal(localized.sprite,f.sprite);}
});
test('language changes preserve canonical combinations and user-created names',()=>{
 const config=normalizeConfig({...HERO_PRESETS.berry,name:'Ehsan’s special <scoop>'});const before=JSON.stringify(config);
 assert.equal(creationName(config,'en'),'Ehsan’s special <scoop>');assert.equal(creationName(config,'fa'),config.name);
 assert.match(describe(config,'en'),/Strawberry \+ Blueberry \+ Vanilla in a waffle cone, Strawberry sauce/);
 assert.ok(persian.test(describe(config,'fa')));assert.equal(JSON.stringify(config),before);assert.equal(priceOf(config),220000);
 assert.equal(money(220000,'en'),'220,000 toman');assert.equal(number(2,'en'),'2');
});
test('static language switching is reversible and preserves surrounding whitespace',()=>{
 const text={isConnected:true,textContent:'  طعم‌ها '};const attr={isConnected:true,setAttribute(k,v){this[k]=v;}};
 const snapshots=[{node:text,original:'  طعم‌ها ',key:'طعم‌ها'},{node:attr,attribute:'aria-label',original:'بستن سبد خرید',key:'بستن سبد خرید'}];
 applyStaticLanguage(snapshots,'en');assert.equal(text.textContent,'  Flavors ');assert.equal(attr['aria-label'],'Close shopping bag');
 applyStaticLanguage(snapshots,'fa');assert.equal(text.textContent,'  طعم‌ها ');assert.equal(attr['aria-label'],'بستن سبد خرید');
});
test('the actual cart renderer supports both languages with an existing saved item',()=>{
 const source=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');const renderer=source.slice(source.indexOf('function renderCart(){'),source.indexOf('function openDialog('));
 const cart=[{config:normalizeConfig(HERO_PRESETS.berry),qty:2}];
 for(const language of ['fa','en']){
  setLanguageValue(language);const elements={};const get=id=>elements[id]??= {setAttribute(k,v){this[k]=v;}};
  vm.runInNewContext(renderer+'\nrenderCart();',{cart,$:get,t,faNumber:number,money,creationName,describeConfig:describe,cartTotal,priceOf,flavorById,esc:escapeHTML,sprite:()=>'<span></span>'});
  assert.match(elements['cart-items'].innerHTML,/data-qty="0"/);assert.equal(elements['cart-total'].textContent,money(440000));
  if(language==='en'){assert.match(elements['cart-items'].innerHTML,/Violet Dream/);assert.ok(!persian.test(elements['cart-items'].innerHTML));}
  else assert.match(elements['cart-items'].innerHTML,/رویای بنفش/);
 }
 setLanguageValue('fa');
});
test('every hero preset has a dedicated raster product image',()=>{
 assert.deepEqual(Object.keys(HERO_ASSETS),Object.keys(HERO_PRESETS));assert.equal(new Set(Object.values(HERO_ASSETS)).size,3);
 for(const file of Object.values(HERO_ASSETS)){const data=fs.readFileSync(new URL('../dist/'+file,import.meta.url));assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WEBP');}
});

test('custom names matching Object prototype keys remain plain text in either language',()=>{
 for(const language of ['fa','en'])for(const name of ['constructor','__proto__','toString','hasOwnProperty','valueOf']){
  const config=normalizeConfig({scoops:['vanilla'],name});
  assert.equal(translate(name,language),name);
  assert.equal(t(name,{},language),name);
  assert.equal(creationName(config,language),name);
 }
});

test('changing language preserves the open mobile menu and its correct accessible label',()=>{
 const source=fs.readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 const start=source.indexOf('function applyLanguage(');
 const end=source.indexOf("$('language-toggle').addEventListener",start);
 assert.ok(start>=0&&end>start);
 const code=source.slice(start,end);
 for(const open of [false,true])for(const language of ['en','fa']){
  const elements={};
  const get=id=>elements[id]??={open:false,hidden:false,attrs:{},setAttribute(k,v){this.attrs[k]=String(v);},getAttribute(k){return this.attrs[k]??null;}};
  get('mobile-nav').hidden=!open;
  get('menu-toggle').attrs['aria-expanded']=String(open);
  get('menu-toggle').attrs['aria-label']='بازکردن منو';
  const snapshots=[{node:{isConnected:true,setAttribute:(k,v)=>get('menu-toggle').setAttribute(k,v)},attribute:'aria-label',original:'بازکردن منو',key:'بازکردن منو'}];
  const document={documentElement:{}};
  const location={href:'http://127.0.0.1:3000/?existing=1#studio'};
  const history={state:null,replaceState(_state,_title,url){this.url=String(url);}};
  const noop=()=>{};
  vm.runInNewContext(code+'\napplyLanguage(language);',{language,$:get,staticTranslations:snapshots,setLanguageValue,getLanguage,applyStaticLanguage,t,document,location,URL,history,persist:noop,renderFlavors:noop,renderBuilder:noop,renderCart:noop,renderHero:noop,setMotion:noop,showProduct:noop,selectedHero:'signature',motionChoice:false,reducedMotion:{matches:false}});
  assert.equal(get('mobile-nav').hidden,!open);
  assert.equal(get('menu-toggle').attrs['aria-expanded'],String(open));
  assert.equal(get('menu-toggle').attrs['aria-label'],t(open?'بستن منو':'بازکردن منو',{},language));
  assert.equal(document.documentElement.lang,language);
  assert.equal(document.documentElement.dir,language==='en'?'ltr':'rtl');
  assert.equal(new URL(history.url).searchParams.get('existing'),'1');
  assert.equal(new URL(history.url).hash,'#studio');
 }
 setLanguageValue('fa');
});
