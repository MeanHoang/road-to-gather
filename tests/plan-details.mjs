import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});await page.goto('http://localhost:5173/#journey');
const issues=[];
for(const [width,height] of [[1366,768],[390,844],[360,640]]){
 await page.setViewportSize({width,height});
 if(await page.getByRole('button',{name:'Cả ngày',exact:true}).isVisible())await page.getByRole('button',{name:'Cả ngày',exact:true}).click();
 for(const place of ['Hà Giang','Đà Nẵng']){
  await page.locator('.scene-active .segmented').getByRole('button',{name:place,exact:true}).click();
  if(place==='Đà Nẵng')await page.getByRole('button',{name:/Tiết kiệm · 2,6tr/}).click();
  for(let day=0;day<3;day++){
   await page.getByRole('tab',{name:new RegExp('Ngày '+(day+1))}).click();
   const count=await page.locator('.compact-timeline li').count();assert.ok(count>=10);
   for(let stop=0;stop<count;stop++){
    if(width<701&&stop>0)await page.getByRole('button',{name:'Cả ngày',exact:true}).click();
    await page.locator('.compact-timeline button').nth(stop).click();
    const problems=await page.locator('.inline-stop-detail').evaluate(el=>{
     const overflow=el.scrollHeight>el.clientHeight+3;
     const bottom=[...el.querySelectorAll('button,a')].some(n=>n.getBoundingClientRect().bottom>innerHeight-68);
     return {overflow,bottom,h:el.clientHeight,sh:el.scrollHeight};
    });
    if(problems.overflow||problems.bottom)issues.push({width,height,place,day,stop,...problems});
    assert.equal(await page.locator('dialog').count(),0);
   }
   if(width<701)await page.getByRole('button',{name:'Cả ngày',exact:true}).click();
  }
 }
 await page.screenshot({path:`/tmp/rtg-plan-final-${width}.png`});
}
console.log(JSON.stringify(issues,null,2));await browser.close();assert.deepEqual(issues,[]);
