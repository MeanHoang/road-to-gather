import {accessToken,readCredential} from '../scripts/google-auth.mjs';
const decode=value=>{
 if(value.stringValue!==undefined)return value.stringValue;
 if(value.booleanValue!==undefined)return value.booleanValue;
 if(value.integerValue!==undefined)return Number(value.integerValue);
 if(value.doubleValue!==undefined)return value.doubleValue;
 if(value.timestampValue!==undefined)return value.timestampValue;
 if(value.arrayValue!==undefined)return(value.arrayValue.values||[]).map(decode);
 if(value.mapValue!==undefined)return Object.fromEntries(Object.entries(value.mapValue.fields||{}).map(([k,v])=>[k,decode(v)]));
 return null;
};
export function ownerAuthPlugin(env){
 let cachedToken=null,tokenUntil=0;
 const bearer=async()=>{if(!cachedToken||Date.now()>tokenUntil){cachedToken=await accessToken(env.RTG_SERVICE_ACCOUNT_PATH);tokenUntil=Date.now()+3000000}return cachedToken};
 return {name:'road-to-gather-results',configureServer(server){
 server.middlewares.use(async(req,res,next)=>{
  const pathname=new URL(req.url,'http://local').pathname;
  if(pathname!=='/api/owner-results')return next();
  const send=(status,payload)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(payload))};
  if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return send(403,{error:'Nguồn truy cập không hợp lệ.'});
  if(pathname==='/api/owner-results'){
   if(req.method!=='GET')return send(405,{error:'Chỉ hỗ trợ GET.'});
   try{
    const credential=readCredential(env.RTG_SERVICE_ACCOUNT_PATH),token=await bearer(),records=[];let pageToken;
    do{const url=new URL(`https://firestore.googleapis.com/v1/projects/${credential.project_id}/databases/(default)/documents/tripResponses`);url.searchParams.set('pageSize','100');url.searchParams.set('orderBy','createdAt desc');if(pageToken)url.searchParams.set('pageToken',pageToken);
     const r=await fetch(url,{headers:{Authorization:'Bearer '+token}}),data=await r.json();if(!r.ok)throw new Error('Firestore read failed');
     for(const doc of data.documents||[])records.push({id:doc.name.split('/').pop(),...Object.fromEntries(Object.entries(doc.fields||{}).map(([key,value])=>[key,decode(value)]))});pageToken=data.nextPageToken;
    }while(pageToken);
    return send(200,{records});
   }catch{return send(502,{error:'Chưa đọc được dữ liệu Firestore. Thử lại sau.'})}
  }
 });
 }};
}
