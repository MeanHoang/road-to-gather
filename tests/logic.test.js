import {test} from 'node:test';
import assert from 'node:assert/strict';
import {destinations,total,dateChoices,getDestination} from '../src/data.js';
import {validateResponse,cleanResponse} from '../src/adapter.js';
const valid={destination:'hagiang',budget:'25to3',transport:'coach',startDate:'2027-01-01',endDate:'2027-01-03',name:'An',contact:'an@example.com',note:'',consent:true};
test('3-day plans have consistent expense totals',()=>{assert.equal(total(destinations.hagiang),2600000);assert.equal(total(destinations.danang),2600000);for(const d of Object.values(destinations)){assert.equal(d.days.length,3);assert.ok(d.costs.every(([,n])=>Number.isInteger(n)&&n>0));}});
test('date options are three-day Friday-to-Sunday trips',()=>{for(const [date] of dateChoices.slice(0,1)){assert.equal(new Date(date+'T12:00:00Z').getUTCDay(),5)}});
test('response requires complete, valid choices and consent',()=>{assert.equal(validateResponse(valid),'');for(const patch of [{destination:''},{budget:''},{transport:''},{startDate:''},{endDate:'2026-12-01'},{startDate:'2027-02-30'},{name:' '},{consent:false},{note:'a'.repeat(501)}])assert.ok(validateResponse({...valid,...patch}));});

test('Golden Bridge is an explicit over-budget variant, not hidden in the 2–3m estimate',()=>{assert.equal(total(getDestination('danang','budget')),2600000);assert.equal(total(getDestination('danang','bana')),3625000);assert.match(getDestination('danang','bana').note,/vượt trần/)});

test('removed email cannot survive a draft migration or submitted payload',()=>{assert.equal(cleanResponse({...valid,contact:'private@example.com'}).contact,undefined)});
