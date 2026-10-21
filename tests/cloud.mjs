import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {googleRequest,readCredential} from '../scripts/google-auth.mjs';
const origin='http://localhost:5173';
const marker='KIEM_THU_TAM_'+Date.now();let createdId;
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const visitor=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:1000}}),owner=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:1000}});
 const publicPage=await visitor.newPage();
 assert.equal((await publicPage.request.get(origin+'/api/owner-results')).status(),200);
 await publicPage.goto(origin+'/#quiz');
 assert.equal(await publicPage.getByRole('textbox',{name:'Email liên hệ'}).count(),0);
 await publicPage.getByRole('radio',{name:/Xuống biển/}).click();await publicPage.getByRole('button',{name:'Tiếp theo',exact:true}).click();
 await publicPage.getByRole('radio',{name:/2,5 – 3 triệu/}).click();await publicPage.getByRole('button',{name:'Tiếp theo',exact:true}).click();
 await publicPage.getByRole('radio',{name:/Xe khách Ưu tiên/}).click();await publicPage.getByRole('button',{name:'Tiếp theo',exact:true}).click();
 await publicPage.getByLabel('Ngày bắt đầu',{exact:true}).fill('2027-01-01');await publicPage.getByLabel('Ngày kết thúc',{exact:true}).fill('2027-01-03');await publicPage.getByRole('button',{name:'Tiếp theo',exact:true}).click();
 await publicPage.getByRole('textbox',{name:'Tên của bạn',exact:true}).fill(marker);
 await publicPage.getByRole('textbox',{name:/Nhắn nhóm/}).fill('Lời nhắn kiểm thử riêng cho chủ nhóm.');
 await publicPage.getByRole('checkbox',{name:/Mình đồng ý/}).check();
 await publicPage.getByRole('button',{name:'Gửi lựa chọn',exact:true}).click();
 await publicPage.getByRole('heading',{name:'Cảm ơn '+marker+' nhé!'}).waitFor({timeout:45000});
 assert.match(await publicPage.locator('.success').innerText(),/Firestore/);
 const page=await owner.newPage();await page.goto(origin+'/tong-ket');
 await page.locator('.results-heading').waitFor();
 assert.equal(await page.locator('input[type=password]').count(),0);
 const response=await page.request.get(origin+'/api/owner-results');assert.equal(response.status(),200);const records=(await response.json()).records;
 const row=records.find(r=>r.name===marker);assert.ok(row);createdId=row.id;assert.equal(row.budget,'25to3');assert.equal(row.startDate,'2027-01-01');assert.equal(row.endDate,'2027-01-03');assert.equal(row.contact,undefined);assert.equal(row.note,'Lời nhắn kiểm thử riêng cho chủ nhóm.');
 assert.equal((await publicPage.request.get(origin+'/api/owner-results')).status(),200);
 const publicRead=await publicPage.request.get(`https://firestore.googleapis.com/v1/projects/${readCredential().project_id}/databases/(default)/documents/tripResponses/${createdId}`);assert.equal(publicRead.status(),403);
 assert.equal(await publicPage.getByRole('link',{name:'Tổng kết',exact:true}).count(),0);
 await page.screenshot({path:'/tmp/rtg-owner-live.png'});
 console.log('PASS: real anonymous Firestore submission without email; results route without login; exact stored choices and note; results API accessible without session; direct Firestore read denied.');
}finally{
 if(createdId){const result=await googleRequest(`https://firestore.googleapis.com/v1/projects/${readCredential().project_id}/databases/(default)/documents/tripResponses/${createdId}`,{method:'DELETE'});assert.equal(result.status,200);console.log('Temporary integration response deleted; no fake participant left in survey.');}
 await browser.close();
}
