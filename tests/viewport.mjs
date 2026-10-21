import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});
await page.goto('http://localhost:5173/');
const issues=[];
for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[360,640]]){
 await page.setViewportSize({width,height});
 for(let i=0;i<8;i++){
  await page.locator('.scene-dots button').nth(i).click();
  const dimensions=await page.locator('.scene-active').evaluate(el=>{
   const section=el.firstElementChild;
   const overflow=[el,section,...el.querySelectorAll('.day-reader,.day-story,.budget-paper,.facts-reader,.quiz-card,form,.quiz-question')].filter(Boolean).filter(n=>n.scrollHeight>n.clientHeight+3||n.scrollWidth>n.clientWidth+3).map(n=>({class:n.className,h:n.clientHeight,sh:n.scrollHeight,w:n.clientWidth,sw:n.scrollWidth}));
   const cutButtons=[...el.querySelectorAll('button,input,textarea,a')].filter(n=>n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden').filter(n=>{const r=n.getBoundingClientRect();return r.bottom>innerHeight-68||r.top<65}).map(n=>n.textContent||n.getAttribute('aria-label'));
   return {overflow,cutButtons};
  });
  if(dimensions.overflow.length||dimensions.cutButtons.length)issues.push({width,height,scene:i,...dimensions});
 }
 await page.locator('.scene-dots button').nth(4).click();
 await page.getByRole('tab',{name:/Ngày 2/}).click();
 await page.screenshot({path:`/tmp/rtg-itinerary-${width}.png`});
}
console.log(JSON.stringify(issues,null,2));
await browser.close();
