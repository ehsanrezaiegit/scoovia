import test from 'node:test';
import assert from 'node:assert/strict';
import {previewLayout,HERO_PRESETS} from '../dist/preview.js';
import {normalizeConfig,normalizeCart} from '../dist/model.js';
test('sauce remains on the upper scoop for every vessel and scoop count',()=>{
 for(const vessel of ['cone','cup'])for(const count of [1,2,3]){
  const layout=previewLayout(vessel,count);
  const upperScoopTop=layout.stageHeight-layout.stackBottom-layout.scoopSize-(count-1)*layout.step;
  assert.ok(layout.sauceTop>upperScoopTop&&layout.sauceTop<upperScoopTop+layout.scoopSize/3);
  // Mobile scales the composition, rather than changing its internal height.
  for(const scale of [.73,.83,1])assert.ok((layout.sauceTop-upperScoopTop)*scale>0&&(layout.sauceTop-upperScoopTop)*scale<layout.scoopSize*scale/3);
 }
});
test('preset selection produces an independent editable combination',()=>{
 const editable=normalizeConfig(HERO_PRESETS.berry);editable.scoops[0]='mango';editable.name='custom';
 assert.equal(HERO_PRESETS.berry.scoops[0],'strawberry');assert.equal(HERO_PRESETS.berry.name,'رویای بنفش');
});
test('malformed saved cart rows do not become invented default purchases',()=>{
 assert.deepEqual(normalizeCart([{qty:1},{config:null},{config:{scoops:['unknown']}},{config:{scoops:['vanilla']},qty:2}]),[{config:normalizeConfig({scoops:['vanilla']}),qty:2}]);
});
test('saved choices must be strings, even if an array coerces to a valid name',()=>{
 const c=normalizeConfig({vessel:['cup'],scoops:['vanilla'],sauce:['chocolate'],topping:['pistachio']});
 assert.equal(c.vessel,'cone');assert.equal(c.sauce,'none');assert.equal(c.topping,'none');
});
