import pg from 'pg';
import {readFileSync} from 'node:fs';
process.loadEnvFile('.env.local');
const certificate=await fetch('https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt').then(r=>{if(!r.ok)throw new Error('CA fetch failed');return r.text();});
const connection=new URL(process.env.POSTGRES_URL);connection.searchParams.delete('sslmode');
const client=new pg.Client({connectionString:connection.toString(),ssl:{ca:certificate,rejectUnauthorized:true},connectionTimeoutMillis:20000});
try{await client.connect();const result=await client.query("select to_regclass('public.profiles') as profiles");if(!result.rows[0].profiles){await client.query('begin');await client.query(readFileSync('supabase/migrations/001_initial.sql','utf8'));await client.query(readFileSync('supabase/seed.sql','utf8'));await client.query('commit');console.log('Applied schema and 192 product seed records.');}else console.log('Schema already applied.');}catch(error){console.error('Database initialization failed:',error.code||error.name);process.exitCode=1;}finally{await client.end();}
