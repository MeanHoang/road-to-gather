import fs from 'node:fs';
import crypto from 'node:crypto';
import {parseEnv} from 'node:util';
const localEnv=fs.existsSync('.env.local')?parseEnv(fs.readFileSync('.env.local','utf8')):{};
export const credentialPath=process.env.RTG_SERVICE_ACCOUNT_PATH||localEnv.RTG_SERVICE_ACCOUNT_PATH;
export function readCredential(path=credentialPath,env=process.env){
 const issue=(code,message)=>Object.assign(new Error(message),{code});
 const settings=!env.VERCEL&&env===process.env?{...localEnv,...env}:env;
 const splitKeys=['RTG_FIREBASE_PROJECT_ID','RTG_FIREBASE_CLIENT_EMAIL','RTG_FIREBASE_PRIVATE_KEY'];
 if(splitKeys.some(key=>settings[key])){
  if(!splitKeys.every(key=>settings[key]?.trim()))throw issue('INVALID_SERVICE_ACCOUNT','Cần đủ RTG_FIREBASE_PROJECT_ID, RTG_FIREBASE_CLIENT_EMAIL và RTG_FIREBASE_PRIVATE_KEY.');
  return {project_id:settings.RTG_FIREBASE_PROJECT_ID.trim(),client_email:settings.RTG_FIREBASE_CLIENT_EMAIL.trim(),private_key:settings.RTG_FIREBASE_PRIVATE_KEY.replace(/\\n/g,'\n').trim()};
 }
 const json=settings.RTG_SERVICE_ACCOUNT_JSON;
 if(env.VERCEL&&!json)throw issue('MISSING_SERVICE_ACCOUNT','Thiếu RTG_FIREBASE_PROJECT_ID, RTG_FIREBASE_CLIENT_EMAIL và RTG_FIREBASE_PRIVATE_KEY trên Vercel. Thêm biến cho Production rồi Redeploy.');
 if(!json&&!path)throw issue('MISSING_SERVICE_ACCOUNT','Chưa cấu hình service account cho API tổng kết.');
 let credential;
 try{credential=JSON.parse(json||fs.readFileSync(path,'utf8'))}catch{throw issue('INVALID_SERVICE_ACCOUNT','RTG_SERVICE_ACCOUNT_JSON không phải JSON hợp lệ. Dán toàn bộ nội dung file service account rồi Redeploy.');}
 if(!credential.project_id||!credential.client_email||!credential.private_key)throw issue('INVALID_SERVICE_ACCOUNT','Service account thiếu project_id, client_email hoặc private_key. Cần toàn bộ nội dung file JSON.');
 return credential;
}
export async function accessToken(path=credentialPath,env=process.env){const c=readCredential(path,env),enc=v=>Buffer.from(JSON.stringify(v)).toString('base64url'),now=Math.floor(Date.now()/1000);const body=enc({alg:'RS256',typ:'JWT'})+'.'+enc({iss:c.client_email,scope:'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});const assertion=body+'.'+crypto.sign('RSA-SHA256',Buffer.from(body),c.private_key).toString('base64url');const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})});const data=await r.json();if(!r.ok)throw new Error('Google credential authentication failed ('+r.status+')');return data.access_token}
export async function googleRequest(url,options={}){const token=await accessToken();const r=await fetch(url,{...options,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',...options.headers}});const data=await r.json();return{ok:r.ok,status:r.status,data}}
