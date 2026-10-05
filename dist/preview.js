// Keep one coordinate system at every breakpoint; scale the whole composition.
export function previewLayout(vessel,count){
 const scoopCount=Math.max(1,Math.min(3,Number.isInteger(count)?count:2));
 const stackBottom=vessel==='cup'?125:scoopCount===1?145:scoopCount===2?135:125;
 const scoopSize=195,step=63,stageHeight=430;
 const topScoop=stageHeight-stackBottom-scoopSize-(scoopCount-1)*step;
 return {stageHeight,scoopSize,step,stackBottom,topScoop,sauceTop:topScoop+22};
}

export const HERO_PRESETS={
 signature:{vessel:'cone',scoops:['pistachio','blueberry','vanilla'],sauce:'none',topping:'pistachio',name:'پسته و خیال'},
 berry:{vessel:'cone',scoops:['strawberry','blueberry','vanilla'],sauce:'berry',topping:'none',name:'رویای بنفش'},
 chocolate:{vessel:'cone',scoops:['chocolate','vanilla','chocolate'],sauce:'chocolate',topping:'chocolate',name:'شکلات‌باز'}
};

export const HERO_ASSETS={signature:'assets/hero.webp',berry:'assets/hero-berry.webp',chocolate:'assets/hero-chocolate.webp'};
