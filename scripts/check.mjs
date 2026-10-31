import { readFile, readdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { SourceTextModule } from 'node:vm';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const files=[];
async function walk(dir) { for(const entry of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())await walk(p);else files.push(p);} }
await walk(root);
let pages=0,modules=0;
for(const file of files){
  const text=await readFile(file,'utf8');
  if(file.endsWith('.js')){new SourceTextModule(text,{identifier:file});modules++;assert.ok(!text.includes('__PRECACHE_FILES__'),'Worker precisa ser preparado');}
  if(file.endsWith('.html')){
    pages++;assert.ok(/<html[^>]*lang="pt-BR"/.test(text),file+' precisa de idioma');assert.equal([...text.matchAll(/<h1[ >]/g)].length,1,file+' precisa de um h1');
    const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,file+' tem IDs duplicados');
    assert.ok(!/\$\{[A-Za-z_]/.test(text),file+' saiu do build com placeholder não interpolado');
    for(const match of text.matchAll(/\b(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)){let target=path.join(root,decodeURIComponent(match[1]).split('?')[0]);try{if((await stat(target)).isDirectory())target=path.join(target,'index.html');await stat(target);}catch{throw new Error(file+' aponta para recurso ausente: '+match[1]);}}
  }
}
const home=await readFile(path.join(root,'index.html'),'utf8');
for(const match of home.matchAll(/href="(https:\/\/www\.amazon\.com\.br[^" ]+)"/g)){assert.equal(new URL(match[1].replaceAll('&amp;','&')).searchParams.get('tag'),'abcinvestimen-20');}
const manifest=JSON.parse(await readFile(path.join(root,'manifest.webmanifest'),'utf8'));assert.deepEqual(manifest.icons.map(i=>i.sizes),['192x192','512x512']);
assert.ok(home.includes('Como participante do Programa de Associados da Amazon'));
console.log(`${pages} páginas e ${modules} módulos verificados: sintaxe, recursos, IDs, metadados básicos, manifesto e tag Amazon.`);
