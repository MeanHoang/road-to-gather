import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});
await page.goto('http://localhost:5173/');
const issues=[];
async function audit(width,height,label){
 const problem=await page.locator('.scene-active').evaluate(el=>{
  const targets=[el,el.firstElementChild,...el.querySelectorAll('.inline-stop-detail,.day-reader,.day-story,.budget-paper,.facts-reader,.quiz-card,form,.quiz-question')];
  const overflow=targets.filter(Boolean).filter(n=>n.scrollHeight>n.clientHeight+3||n.scrollWidth>n.clientWidth+3).map(n=>({class:n.className,h:n.clientHeight,sh:n.scrollHeight}));
  const cuts=[...el.querySelectorAll('button,input,textarea,a')].filter(n=>n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden').filter(n=>{const r=n.getBoundingClientRect();return r.bottom>innerHeight-67||r.top<64}).map(n=>n.textContent||n.getAttribute('aria-label'));
  return{overflow,cuts};
 });
 if(problem.overflow.length||problem.cuts.length)issues.push({width,height,label,...problem});
}
for(const [width,height] of [[1366,768],[390,844],[360,640]]){
 await page.setViewportSize({width,height});
 for(let i=0;i<8;i++){await page.locator('.scene-dots button').nth(i).click();await audit(width,height,'scene '+i)}
 for(const place of ['Hà Giang','Đà Nẵng']){
  await page.locator('.scene-dots button').nth(4).click();
  await page.locator('.scene-active .segmented').getByRole('button',{name:place,exact:true}).click();
  for(let day=0;day<3;day++){await page.getByRole('tab',{name:new RegExp('Ngày '+(day+1))}).click();await audit(width,height,place+' day '+day)}
  await page.locator('.scene-dots button').nth(5).click();
  await page.getByRole('button',{name:'Các khoản tiếp theo',exact:true}).click();await audit(width,height,place+' cost page 2');
  await page.locator('.scene-dots button').nth(6).click();
  for(const tab of ['Thời gian & di chuyển','Thời tiết','Ngân sách & nguồn']){await page.getByRole('tab',{name:tab,exact:true}).click();await audit(width,height,place+' '+tab)}
 }
 await page.evaluate(()=>{localStorage.clear();history.replaceState(null,'','/#quiz')});await page.reload();
 await audit(width,height,'quiz0');
 await page.getByRole('radio',{name:/Xuống biển/}).click();await page.getByRole('button',{name:'Tiếp theo',exact:true}).click();await audit(width,height,'quiz1');
 await page.getByRole('radio',{name:/2,5 – 3 triệu/}).click();await page.getByRole('button',{name:'Tiếp theo',exact:true}).click();await audit(width,height,'quiz2');
 await page.getByRole('radio',{name:/Xe khách Ưu tiên/}).click();await page.getByRole('button',{name:'Tiếp theo',exact:true}).click();await audit(width,height,'quiz3');
 await page.getByLabel('Ngày bắt đầu',{exact:true}).fill('2027-01-01');await page.getByLabel('Ngày kết thúc',{exact:true}).fill('2027-01-03');await page.getByRole('button',{name:'Tiếp theo',exact:true}).click();await audit(width,height,'quiz4');
 await page.getByRole('button',{name:'Gửi lựa chọn',exact:true}).click();await audit(width,height,'quiz4 validation');
 await page.screenshot({path:`/tmp/rtg-quiz-success-${width}.png`});
}
console.log(JSON.stringify(issues,null,2));
await browser.close();
assert.deepEqual(issues,[],'Every day, expense page, research tab, quiz step and error should fit without scrolling or cut controls');
