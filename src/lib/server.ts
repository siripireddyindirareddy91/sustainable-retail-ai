import { createClient } from '@supabase/supabase-js';
export const configured=()=>Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export function database(token?:string){if(!configured())return null;return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{global:token?{headers:{Authorization:`Bearer ${token}`}}:undefined,auth:{persistSession:false}});}
export async function identity(request:Request){const token=request.headers.get('authorization')?.replace(/^Bearer /,'');if(!token)return null;const db=database(token);if(!db)return null;const {data,error}=await db.auth.getUser(token);return error?null:{user:data.user,db};}
export async function administrator(request:Request){const auth=await identity(request);if(!auth)return null;const {data}=await auth.db.from('roles').select('role').eq('user_id',auth.user.id).eq('role','admin').maybeSingle();return data?auth:null;}
