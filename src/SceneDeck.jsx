import React, {Children, useCallback, useEffect, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, ChevronDown} from 'lucide-react';

const scenes = [
 ['intro','Mở hành trình'], ['hagiang','Hà Giang'], ['danang','Đà Nẵng'],
 ['destinations','Hai lựa chọn'], ['journey','Lịch trình'], ['budget','Chi phí'],
 ['research','Thông tin tham khảo'], ['quiz','Khảo sát']
];
export function navigateScene(id) {window.dispatchEvent(new CustomEvent('rtg:navigate',{detail:id}));}
export default function SceneDeck({children,onSceneChange}) {
 const [index,setIndex]=useState(()=>Math.max(0,scenes.findIndex(([id])=>id===location.hash.slice(1))));
 const [leaving,setLeaving]=useState(null);
 const [direction,setDirection]=useState('forward');
 const current=useRef(index);const panel=useRef(null);const locked=useRef(0);const callback=useRef(onSceneChange);
 callback.current=onSceneChange;
 const go=useCallback((next)=>{
  const value=Math.max(0,Math.min(scenes.length-1,next));
  if(current.current===value)return;
  setLeaving(current.current);setDirection(value>current.current?'forward':'backward');
  current.current=value;locked.current=performance.now()+1100;
  setIndex(value);history.replaceState(null,'','#'+scenes[value][0]);
  callback.current?.(scenes[value][0]);
 },[]);
 useEffect(()=>{
  document.documentElement.classList.add('scene-mode');
  let accumulated=0,lastWheel=0,touch=null;
  const wheel=e=>{
   if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
   if(e.target.closest('dialog,form,input,textarea,select,[role="radiogroup"]')){e.preventDefault();return;}
   const direction=Math.sign(e.deltaY);
   e.preventDefault();
   const now=performance.now();
   if(now<locked.current){lastWheel=now;return;}
   if(now-lastWheel>180)accumulated=0;
   lastWheel=now;accumulated+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
   if(Math.abs(accumulated)>45){go(current.current+Math.sign(accumulated));accumulated=0;}
  };
  const navigate=e=>{const next=scenes.findIndex(([id])=>id===e.detail);if(next>=0)go(next)};
  const click=e=>{
   const anchor=e.target.closest('a[href^="#"]');if(!anchor)return;
   const id=anchor.getAttribute('href').slice(1)||'intro';
   const next=scenes.findIndex(([key])=>key===id);
   if(next>=0){e.preventDefault();go(next);}
  };
  const key=e=>{
   if(e.target.closest('dialog,input,textarea,select,button,a,form')||e.altKey||e.ctrlKey||e.metaKey)return;
   if(['ArrowDown','PageDown','ArrowUp','PageUp'].includes(e.key)){
    const direction=['ArrowDown','PageDown'].includes(e.key)?1:-1;
    e.preventDefault();if(performance.now()>locked.current)go(current.current+direction);
   }
  };
  const start=e=>{if(e.touches.length===1)touch={x:e.touches[0].clientX,y:e.touches[0].clientY,target:e.target};};
  const move=e=>{if(touch&&!e.target.closest('input,textarea,select'))e.preventDefault();};
  const end=e=>{
   if(!touch)return;const dy=touch.y-e.changedTouches[0].clientY,dx=touch.x-e.changedTouches[0].clientX;
   if(Math.abs(dy)>65&&Math.abs(dy)>Math.abs(dx)&&performance.now()>locked.current&&!touch.target.closest('form,input,textarea,select'))go(current.current+Math.sign(dy));
   touch=null;
  };
  const hash=()=>{const next=scenes.findIndex(([id])=>id===location.hash.slice(1));if(next>=0)go(next)};
  addEventListener('wheel',wheel,{passive:false});addEventListener('rtg:navigate',navigate);document.addEventListener('click',click);addEventListener('keydown',key);addEventListener('hashchange',hash);
  panel.current?.addEventListener('touchstart',start,{passive:true});panel.current?.addEventListener('touchmove',move,{passive:false});panel.current?.addEventListener('touchend',end,{passive:true});
  const deck=panel.current;
  return()=>{document.documentElement.classList.remove('scene-mode');removeEventListener('wheel',wheel);removeEventListener('rtg:navigate',navigate);document.removeEventListener('click',click);removeEventListener('keydown',key);removeEventListener('hashchange',hash);deck?.removeEventListener('touchstart',start);deck?.removeEventListener('touchmove',move);deck?.removeEventListener('touchend',end)};
 },[go]);
 useEffect(()=>{document.documentElement.dataset.scene=scenes[index][0]},[index]);
 useEffect(()=>{const timer=setTimeout(()=>setLeaving(null),1100);return()=>clearTimeout(timer)},[index]);
 useEffect(()=>{const active=panel.current?.querySelector('.scene-active');active?.scrollTo(0,0);},[index]);
 return <><main ref={panel} className={'scene-deck scene-index-'+index} data-direction={direction}>
  {Children.toArray(children).map((child,i)=><div key={scenes[i]?.[0]||i} className={'scene-panel '+(index===i?'scene-active':leaving===i?'scene-exit':i<index?'scene-before':'scene-after')} inert={index!==i} aria-hidden={index!==i} data-scene={scenes[i]?.[0]}>{child}</div>)}
 </main><div className="scene-navigation"><button aria-label="Cảnh trước" onClick={()=>go(index-1)} disabled={index===0}><ArrowLeft size={16}/></button><div className="scene-dots" role="group" aria-label="Chọn cảnh">{scenes.map(([id,name],i)=><button key={id} onClick={()=>go(i)} className={i===index?'selected':''} aria-label={'Cảnh '+(i+1)+': '+name} aria-current={i===index?'step':undefined}><i/></button>)}</div><span className="scene-count"><b>{String(index+1).padStart(2,'0')}</b> / {String(scenes.length).padStart(2,'0')}</span><button aria-label="Cảnh tiếp theo" onClick={()=>go(index+1)} disabled={index===scenes.length-1}><ArrowRight size={16}/></button></div><div className="scene-status" aria-live="polite">{scenes[index][1]}</div><div className="wheel-hint"><ChevronDown size={13}/>{index<3?'Lăn chuột hoặc vuốt để đổi cảnh':'Lăn chuột để đổi cảnh · Nội dung xem bằng tab'}</div></>;
}
