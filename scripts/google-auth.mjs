import fs from 'node:fs';
import crypto from 'node:crypto';
export const credentialPath=process.env.RTG_SERVICE_ACCOUNT_PATH||(fs.existsSync('.env.local')?fs.readFileSync('.env.local','utf8').split('\n').find(line=>line.startsWith('RTG_SERVICE_ACCOUNT_PATH='))?.slice('RTG_SERVICE_ACCOUNT_PATH='.length):undefined);
export function readCredential(path=credentialPath,env=process.env){
 const issue=(code,message)=>Object.assign(new Error(message),{code});
 if(env.VERCEL&&!env.RTG_SERVICE_ACCOUNT_JSON)throw issue('MISSING_SERVICE_ACCOUNT','Thiếu RTG_SERVICE_ACCOUNT_JSON trên Vercel. Thêm biến cho Production rồi Redeploy.');
 if(!env.RTG_SERVICE_ACCOUNT_JSON&&!path)throw issue('MISSING_SERVICE_ACCOUNT','Chưa cấu hình service account cho API tổng kết.');
 let credential;
 try{credential=JSON.parse(env.RTG_SERVICE_ACCOUNT_JSON||fs.readFileSync(path,'utf8'))}catch{throw issue('INVALID_SERVICE_ACCOUNT','RTG_SERVICE_ACCOUNT_JSON không phải JSON hợp lệ. Dán toàn bộ nội dung file service account rồi Redeploy.');}
 if(!credential.project_id||!credential.client_email||!credential.private_key)throw issue('INVALID_SERVICE_ACCOUNT','Service account thiếu project_id, client_email hoặc private_key. Cần toàn bộ nội dung file JSON.');
 return credential;
}
export async function accessToken(path=credentialPath,env=process.env){const c=readCredential(path,env),enc=v=>Buffer.from(JSON.stringify(v)).toString('base64url'),now=Math.floor(Date.now()/1000);const body=enc({alg:'RS256',typ:'JWT'})+'.'+enc({iss:c.client_email,scope:'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});const assertion=body+'.'+crypto.sign('RSA-SHA256',Buffer.from(body),c.private_key).toString('base64url');const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})});const data=await r.json();if(!r.ok)throw new Error('Google credential authentication failed ('+r.status+')');return data.access_token}
export async function googleRequest(url,options={}){const token=await accessToken();const r=await fetch(url,{...options,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',...options.headers}});const data=await r.json();return{ok:r.ok,status:r.status,data}}
