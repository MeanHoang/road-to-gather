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
export function createResultsHandler(env=process.env){
 let cachedToken=null,tokenUntil=0;
 const bearer=async()=>{if(!cachedToken||Date.now()>tokenUntil){cachedToken=await accessToken(env.RTG_SERVICE_ACCOUNT_PATH,env);tokenUntil=Date.now()+3000000}return cachedToken};
 return async(req,res,next=()=>{})=>{
  const pathname=new URL(req.url,'http://local').pathname;
  if(pathname!=='/api/owner-results')return next();
  const send=(status,payload)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(payload))};
  if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return send(403,{error:'Nguồn truy cập không hợp lệ.'});
  if(pathname==='/api/owner-results'){
   if(req.method!=='GET')return send(405,{error:'Chỉ hỗ trợ GET.'});
   try{
    const credential=readCredential(env.RTG_SERVICE_ACCOUNT_PATH,env),token=await bearer(),records=[];let pageToken;
    do{const url=new URL(`https://firestore.googleapis.com/v1/projects/${credential.project_id}/databases/(default)/documents/tripResponses`);url.searchParams.set('pageSize','100');url.searchParams.set('orderBy','createdAt desc');if(pageToken)url.searchParams.set('pageToken',pageToken);
     const r=await fetch(url,{headers:{Authorization:'Bearer '+token}}),data=await r.json();if(!r.ok)throw new Error('Firestore read failed');
     for(const doc of data.documents||[])records.push({id:doc.name.split('/').pop(),...Object.fromEntries(Object.entries(doc.fields||{}).map(([key,value])=>[key,decode(value)]))});pageToken=data.nextPageToken;
    }while(pageToken);
    return send(200,{records});
   }catch(error){
    const configError=['MISSING_SERVICE_ACCOUNT','INVALID_SERVICE_ACCOUNT'].includes(error.code);
    console.error('Results API failed:',configError?error.code:'FIRESTORE_READ_FAILED');
    return send(configError?503:502,{code:configError?error.code:'FIRESTORE_READ_FAILED',error:configError?error.message:'Không xác thực hoặc đọc được Firestore. Kiểm tra service account và quyền truy cập trong Vercel.'});
   }
  }
 };
}
export function ownerAuthPlugin(env){return {name:'road-to-gather-results',configureServer(server){server.middlewares.use(createResultsHandler(env))}}}
