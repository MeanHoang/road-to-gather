import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readCredential} from '../scripts/google-auth.mjs';

const split={VERCEL:'1',RTG_FIREBASE_PROJECT_ID:'test-project',RTG_FIREBASE_CLIENT_EMAIL:'test@example.com',RTG_FIREBASE_PRIVATE_KEY:'first\\nsecond\\n'};

test('split server env supports escaped and actual private key newlines',()=>{
 assert.equal(readCredential(undefined,split).private_key,'first\nsecond\n'.trim());
 assert.equal(readCredential(undefined,{...split,RTG_FIREBASE_PRIVATE_KEY:'first\nsecond'}).private_key,'first\nsecond');
});

test('partial server credentials fail without falling back to old JSON',()=>{
 assert.throws(()=>readCredential(undefined,{...split,RTG_FIREBASE_CLIENT_EMAIL:'',RTG_SERVICE_ACCOUNT_JSON:'{}'}),{code:'INVALID_SERVICE_ACCOUNT'});
});

test('Vercel cannot use a local credential file or local env as fallback',()=>{
 assert.throws(()=>readCredential('/unused-local-file',{VERCEL:'1'}),{code:'MISSING_SERVICE_ACCOUNT'});
});

test('existing JSON deployments remain supported',()=>{
 const credential={project_id:'test',client_email:'test@example.com',private_key:'test-key'};
 assert.deepEqual(readCredential(undefined,{VERCEL:'1',RTG_SERVICE_ACCOUNT_JSON:JSON.stringify(credential)}),credential);
});
