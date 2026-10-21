import {firebaseConfig} from './firebase-config.js';
const env = import.meta.env || {};
const config = {apiKey:env.VITE_FIREBASE_API_KEY||firebaseConfig.apiKey,authDomain:env.VITE_FIREBASE_AUTH_DOMAIN||firebaseConfig.authDomain,projectId:env.VITE_FIREBASE_PROJECT_ID||firebaseConfig.projectId,appId:env.VITE_FIREBASE_APP_ID||firebaseConfig.appId};
export const isConnected=Object.values(config).every(Boolean);
export const DRAFT_KEY='rtg-quiz-v1';
export const RESPONSES_KEY='rtg-responses-v2';
const choiceKeys=['destination','budget','transport','startDate','endDate','name'];
export function cleanResponse(value={}) {return {destination:value.destination||'',budget:['under2','2to25','25to3','flexible'].includes(value.budget)?value.budget:'',transport:value.transport||'',startDate:typeof value.startDate==='string'?value.startDate:(value.dates?.[0]==='2027-01-01'?'2027-01-01':''),endDate:typeof value.endDate==='string'?value.endDate:(value.dates?.[0]==='2027-01-01'?'2027-01-03':''),name:typeof value.name==='string'?value.name.trim():'',note:typeof value.note==='string'?value.note:'',consent:value.consent===true};}
export function loadDraft(){try{return cleanResponse(JSON.parse(localStorage.getItem(DRAFT_KEY))||{})}catch{return cleanResponse()}}
export function saveDraft(value){localStorage.setItem(DRAFT_KEY,JSON.stringify(cleanResponse(value)))}
export function validDate(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const date=new Date(value+'T00:00:00Z');return !Number.isNaN(date.getTime())&&date.toISOString().slice(0,10)===value}
export function validateResponse(r){
 if(!['hagiang','danang','either'].includes(r.destination))return 'Bạn chọn một điểm đến nhé.';
 if(!['under2','2to25','25to3','flexible'].includes(r.budget))return 'Chọn mức ngân sách trong khoảng 2–3 triệu nhé.';
 if(!['coach','motorbike','flexible'].includes(r.transport))return 'Chọn phương tiện bạn thích nhé.';
 if(!validDate(r.startDate)||!validDate(r.endDate))return 'Chọn ngày bắt đầu và ngày kết thúc hợp lệ nhé.';
 if(r.endDate<r.startDate)return 'Ngày kết thúc phải từ ngày bắt đầu trở đi.';
 if(typeof r.name!=='string'||!r.name.trim()||r.name.trim().length>80)return 'Tên cần có từ 1 đến 80 ký tự.';
 if(typeof r.note!=='string'||r.note.length>500)return 'Lời nhắn tối đa 500 ký tự.';
 if(!r.consent)return 'Bạn cần đồng ý hiển thị tên và lựa chọn trong tổng kết.';
 return '';
}
export function publicResult(response){return Object.fromEntries(choiceKeys.map(k=>[k,response[k]]))}
function localRecords(){try{const records=JSON.parse(localStorage.getItem(RESPONSES_KEY))||[];return Array.isArray(records)?records:[]}catch{return[]}}
function localResults(){return localRecords().map(r=>({...publicResult(r),id:r.id,createdAt:r.createdAt,version:3})).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))}
let database;
async function firebase(){const [app,fs]=await Promise.all([import('firebase/app'),import('firebase/firestore')]);if(!database)database=fs.getFirestore(app.getApps()[0]||app.initializeApp(config));return {app:app.getApps()[0],db:database,...fs}}
export async function submitResponse(value,id){
 const response=cleanResponse(value);const issue=validateResponse(response);if(issue)throw new Error(issue);
 if(!isConnected){
  const record={...response,id,createdAt:new Date().toISOString(),version:3};
  const records=localRecords().filter(r=>r.id!==id);records.push(record);
  localStorage.setItem(RESPONSES_KEY,JSON.stringify(records));
  localStorage.removeItem(DRAFT_KEY);window.dispatchEvent(new Event('rtg:responses'));
  return {mode:'local'};
 }
 const {db,setDoc,doc,serverTimestamp}=await firebase();
 await setDoc(doc(db,'tripResponses',id),{...response,createdAt:serverTimestamp(),version:3});localStorage.removeItem(DRAFT_KEY);return {mode:'firestore'};
}
export function subscribeResults(onData,onError){
 let stopped=false,timer;
 if(!isConnected){const emit=()=>onData(localResults());emit();window.addEventListener('rtg:responses',emit);window.addEventListener('storage',emit);return()=>{window.removeEventListener('rtg:responses',emit);window.removeEventListener('storage',emit)}}
 const read=async()=>{try{const response=await fetch('/api/owner-results',{credentials:'same-origin',cache:'no-store'});const data=await response.json();if(!response.ok)throw new Error(data.error||'Không đọc được tổng kết của nhóm');if(!stopped)onData(data.records)}catch(error){if(!stopped)onError(error)}finally{if(!stopped)timer=setTimeout(read,15000)}};
 read();return()=>{stopped=true;clearTimeout(timer)};
}

export const firebaseClient=firebase;
