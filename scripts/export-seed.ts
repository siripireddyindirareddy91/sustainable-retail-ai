import {writeFileSync} from 'node:fs';
import {products,categories} from '../src/lib/catalog';
import {assess} from '../src/lib/engine';
const quote=(x:unknown)=>`'${String(x).replaceAll("'","''")}'`;
let sql='-- Synthetic demonstration records. No verified marketplace or environmental claims.\n';
for(const category of categories)sql+=`insert into public.categories(id,name) values(${quote(category.toLowerCase().replace(/[^a-z0-9]+/g,'-'))},${quote(category)}) on conflict do nothing;\n`;
for(const p of products){const a=assess(p);sql+=`insert into public.products(id,name,category,data) values(${quote(p.id)},${quote(p.name)},${quote(p.category)},${quote(JSON.stringify(p))}::jsonb) on conflict(id) do update set data=excluded.data;\n`;sql+=`insert into public.sustainability_sources(product_id,name,attribute,status) values(${quote(p.id)},'Synthetic seed catalog','all','demonstration');\n`;sql+=`insert into public.sustainability_assessments(product_id,score,completeness,methodology,raw_attributes,normalized_scores,confidence) values(${quote(p.id)},${a.score??'null'},${a.completeness},${quote(a.methodology)},${quote(JSON.stringify(p.attributes))}::jsonb,${quote(JSON.stringify(Object.fromEntries(Object.entries(p.attributes).map(([k,v])=>[k,v.value]))))}::jsonb,'demonstration');\n`;}
sql+=`insert into public.model_versions(id,data) values('transparent-hybrid-v1','{"type":"weighted cold-start","validated":false}') on conflict do nothing;\n`;
writeFileSync('supabase/seed.sql',sql);writeFileSync('ai-engine/catalog.json',JSON.stringify(products,null,2));
console.log(`Exported ${products.length} products.`);
