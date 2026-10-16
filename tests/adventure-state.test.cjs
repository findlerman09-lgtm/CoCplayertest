const test = require('node:test');
const assert = require('node:assert/strict');
const model = require('../assets/adventure-state.js');
const engine = require('../assets/development-engine.js');
const base = () => model.ensure({ hp:13, sanity:60, luck:55, skillChecks:[], skillValues:{}, developmentHistory:[], developmentSummaries:[], masteryClaimed:{}, developmentJournal:null });
const catalog = [{ id:'spot-hidden', name:'Spot Hidden', kind:'skill', improvable:true, value:70 }];
const slug='arthur-bell';
const finish = state => model.finish(state,{participated:true,confirmedLegacy:[]});
function resolve(state) {
 let stored=state;
 let rolls=[82,6];
 engine.resolve({ read:()=>stored, write:s=>{stored=s;}, context:model.context(state,slug), investigator:slug, skillId:'spot-hidden', catalog, maxSanity:99, die:()=>rolls.shift() });
 return stored;
}
test('Legacy marks are held unassigned until explicit confirmation',()=>{
 let s=model.ensure({skillChecks:['spot-hidden']});
 assert.deepEqual(s.unattributedChecks,['spot-hidden']); assert.deepEqual(s.experienceChecks,[]);
 assert.throws(()=>finish(s),/older experience/);
 model.finish(s,{participated:true,confirmedLegacy:['spot-hidden']});
 assert.equal(s.experienceChecks[0].adventure_id,'who-is-jack'); assert.equal(model.context(s,slug).checks_complete,true);
});
test('Completion requires a positive participation / Keeper confirmation',()=>{
 const s=base(); assert.throws(()=>model.finish(s,{participated:false,confirmedLegacy:[]})); assert.equal(model.current(s).status,'active');
});
test('New marks get origin without changing the earning decision',()=>{
 const s=base(); model.mark(s,'spot-hidden',true); assert.equal(s.experienceChecks[0].adventure_id,'who-is-jack');
 model.mark(s,'spot-hidden',false); assert.deepEqual(s.experienceChecks,[]); assert.deepEqual(s.skillChecks,[]);
});
test('Resolving development never writes completion or current adventure',()=>{
 let s=base(); model.mark(s,'spot-hidden',true); finish(s); const before=structuredClone(s.adventureProgress);
 assert.equal(model.secondAvailable(s,slug),false); s=resolve(s);
 assert.deepEqual(s.adventureProgress,before); assert.equal(s.experienceChecks[0].resolved,true); assert.equal(s.experienceChecks[0].earned,false);
 assert.equal(model.secondAvailable(s,slug),true); assert.equal(s.skillValues['spot-hidden'],76);
});
test('Second workspace unlocks only after every eligible check resolves',()=>{
 let s=base(); model.mark(s,'spot-hidden',true); model.mark(s,'listen',true); finish(s);
 const both=[...catalog,{id:'listen',name:'Listen',kind:'skill',improvable:true,value:50}];
 engine.resolve({read:()=>s,write:v=>{s=v;},context:model.context(s,slug),investigator:slug,skillId:'spot-hidden',catalog:both,maxSanity:99,die:n=>n===100?82:6});
 assert.equal(model.secondAvailable(s,slug),false);
 engine.resolve({read:()=>s,write:v=>{s=v;},context:model.context(s,slug),investigator:slug,skillId:'listen',catalog:both,maxSanity:99,die:()=>1});
 assert.equal(model.secondAvailable(s,slug),true);
});
test('Second start is distinct, keeps values, and scopes new marks correctly',()=>{
 let s=base(); assert.throws(()=>model.startSecond(s,slug)); model.mark(s,'spot-hidden',true); finish(s); s=resolve(s);
 assert.equal(s.adventureProgress.current,'who-is-jack'); model.startSecond(s,slug);
 assert.equal(s.adventureProgress.current,'how-is-jack'); assert.deepEqual(s.skillChecks,[]); assert.equal(s.skillValues['spot-hidden'],76);
 model.mark(s,'spot-hidden',true); assert.equal(s.experienceChecks.at(-1).adventure_id,'how-is-jack'); assert.equal(s.experienceChecks[0].resolved,true);
});
test('No-check completion unlocks the workspace without RNG',()=>{
 const s=base(); finish(s); engine.completeSummary(s,model.context(s,slug),slug,catalog,()=>new Date().toISOString());
 assert.equal(model.secondAvailable(s,slug),true); assert.equal(s.developmentSummaries[0].no_eligible_checks,true);
});
test('Completed adventures cannot receive new marks',()=>{
 const s=base(); finish(s); assert.throws(()=>model.mark(s,'spot-hidden',true),/closed during development/);
});
test('Future pending development does not revoke the already-earned second workspace',()=>{
 let s=base(); model.mark(s,'spot-hidden',true); finish(s); s=resolve(s); model.startSecond(s,slug);
 s.developmentJournal={phase:'d100-pending',record:{adventure_id:'how-is-jack'}};
 assert.equal(model.secondAvailable(s,slug),true);
});
test('Excluded legacy checks cannot trap no-eligible-check completion',()=>{
 const s=base(); model.mark(s,'credit-rating',true); finish(s); engine.completeSummary(s,model.context(s,slug),slug,catalog,()=>new Date().toISOString());
 assert.equal(model.secondAvailable(s,slug),true);
});
