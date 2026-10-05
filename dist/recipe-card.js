import {flavorById,normalizeConfig,SAUCES,TOPPINGS,VESSELS} from './model.js';
import {localFlavor,creationName,choiceText,translate} from './i18n.js';

function text(ctx,value,x,y,size,maxWidth=900,{color='#372441',weight=400,rtl=true,family='Vazirmatn, Tahoma, sans-serif'}={}){
 ctx.save();ctx.fillStyle=color;ctx.textAlign='center';ctx.direction=rtl?'rtl':'ltr';
 let fontSize=size;ctx.font=`${weight} ${fontSize}px ${family}`;
 while(ctx.measureText(value).width>maxWidth&&fontSize>20){fontSize-=2;ctx.font=`${weight} ${fontSize}px ${family}`;}
 ctx.fillText(value,x,y);ctx.restore();
}
function drawVessel(ctx,vessel){
 ctx.save();
 if(vessel==='cone'){
  ctx.beginPath();ctx.moveTo(370,1100);ctx.lineTo(710,1100);ctx.lineTo(540,1510);ctx.closePath();ctx.clip();
  const shade=ctx.createLinearGradient(370,0,710,0);shade.addColorStop(0,'#b98045');shade.addColorStop(.45,'#edc38b');shade.addColorStop(1,'#c69253');ctx.fillStyle=shade;ctx.fillRect(350,1090,400,430);
  ctx.strokeStyle='#ac733b';ctx.lineWidth=4;
  for(let y=900;y<1690;y+=44){ctx.beginPath();ctx.moveTo(330,y);ctx.lineTo(750,y+265);ctx.stroke();ctx.beginPath();ctx.moveTo(750,y);ctx.lineTo(330,y+265);ctx.stroke();}
 }else{
  const shade=ctx.createLinearGradient(350,0,730,0);shade.addColorStop(0,'#b4c884');shade.addColorStop(.5,'#d9e8af');shade.addColorStop(1,'#b4c884');ctx.fillStyle=shade;
  ctx.beginPath();ctx.moveTo(350,1120);ctx.lineTo(730,1120);ctx.lineTo(690,1390);ctx.lineTo(390,1390);ctx.closePath();ctx.fill();ctx.fillStyle='#e7eed0';ctx.fillRect(350,1120,380,12);
  text(ctx,'scoovia.',540,1280,50,330,{color:'#526836',rtl:false,family:'Georgia, serif'});
 }
 ctx.restore();
}
export function drawRecipeCard(ctx,atlas,raw,language='fa'){
 const config=normalizeConfig(raw);const width=1080,height=1920;
 ctx.fillStyle='#f7f5ed';ctx.fillRect(0,0,width,height);
 text(ctx,'scoovia.',540,145,82,900,{weight:700,rtl:false,family:'Georgia, serif'});
 text(ctx,'MADE BY YOU',540,212,21,900,{color:'#887194',rtl:false,family:'monospace'});
 text(ctx,creationName(config,language),540,357,62,880,{weight:700,rtl:language==='fa'});
 text(ctx,config.scoops.map(id=>localFlavor(flavorById(id),language).name).join(language==='en'?' + ':' و '),540,420,30,880,{color:'#756b77',rtl:language==='fa'});
 ctx.fillStyle='#e3d9eb';ctx.beginPath();ctx.ellipse(540,1035,370,480,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#b9a4c9';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(540,1040,324,396,0,0,Math.PI*2);ctx.stroke();
 drawVessel(ctx,config.vessel);
 config.scoops.forEach((id,i)=>{const f=flavorById(id);ctx.drawImage(atlas,(f.sprite%3)*512,Math.floor(f.sprite/3)*512,512,512,345+(i%2)*25,790-i*140,370,370);});
 const topX=345+((config.scoops.length-1)%2)*25,topY=790-(config.scoops.length-1)*140;
 if(config.sauce!=='none'){
  ctx.save();ctx.translate(topX,topY);ctx.fillStyle=SAUCES[config.sauce].color;
  ctx.beginPath();ctx.moveTo(40,103);ctx.bezierCurveTo(72,36,281,26,333,104);ctx.quadraticCurveTo(324,129,304,112);ctx.lineTo(298,175);ctx.bezierCurveTo(296,202,278,202,273,178);ctx.lineTo(263,103);ctx.quadraticCurveTo(237,76,210,92);ctx.lineTo(202,151);ctx.bezierCurveTo(197,174,181,175,178,151);ctx.lineTo(171,98);ctx.quadraticCurveTo(138,105,114,123);ctx.lineTo(106,168);ctx.bezierCurveTo(102,193,84,190,82,167);ctx.lineTo(78,126);ctx.quadraticCurveTo(47,144,40,103);ctx.fill();ctx.restore();
 }
 if(config.topping!=='none'){
  const colors=config.topping==='pistachio'?['#688b44','#9cba65','#d1b884']:config.topping==='chocolate'?['#442e28','#664438']:['#cf658e','#69a8a0','#efd264','#9272ad'];
  for(let i=0;i<22;i++){ctx.save();ctx.translate(topX+75+(i*41)%215,topY+58+(i*23)%78);ctx.rotate(i*.43);ctx.fillStyle=colors[i%colors.length];ctx.fillRect(-5,-3,config.topping==='sprinkles'?6:12,config.topping==='sprinkles'?16:8);ctx.restore();}
 }
 text(ctx,choiceText('vessel',config.vessel,language),540,1620,28,880,{color:'#756b77',rtl:language==='fa'});
 const extras=[...(config.sauce!=='none'?[choiceText('sauce',config.sauce,language)]:[]),...(config.topping!=='none'?[choiceText('topping',config.topping,language)]:[])].join(' · ');
 if(extras)text(ctx,extras,540,1670,27,880,{color:'#756b77',rtl:language==='fa'});
 ctx.strokeStyle='#dcd7d8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(110,1740);ctx.lineTo(970,1740);ctx.stroke();
 text(ctx,translate('یک قیف، هزار احتمال.',language),540,1810,36,880,{rtl:language==='fa'});
 text(ctx,'SCOOVIA / FLAVOR STUDIO / CONCEPT 03',540,1867,17,900,{color:'#756b77',rtl:false,family:'monospace'});
}
export async function downloadRecipeCard(config,language='fa'){
 await document.fonts.ready;
 const response=await fetch('assets/scoops.webp');if(!response.ok)throw new Error('Could not load scoop artwork');
 const imageUrl=URL.createObjectURL(await response.blob());let outputUrl;
 try{
  const atlas=await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=imageUrl;});
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');drawRecipeCard(ctx,atlas,config,language);
  const png=await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG encoding failed')),'image/png'));
  outputUrl=URL.createObjectURL(png);const anchor=document.createElement('a');anchor.href=outputUrl;anchor.download=`scoovia-my-flavor-${language}-1080x1920.png`;document.body.append(anchor);anchor.click();anchor.remove();
 }finally{URL.revokeObjectURL(imageUrl);if(outputUrl)setTimeout(()=>URL.revokeObjectURL(outputUrl),10000);}
}
