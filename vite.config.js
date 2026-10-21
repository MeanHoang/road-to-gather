import {defineConfig,loadEnv} from 'vite';
import {ownerAuthPlugin} from './server/owner-auth.mjs';
export default defineConfig(({mode})=>({plugins:[ownerAuthPlugin(loadEnv(mode,process.cwd(),''))]}));
