import fs from 'node:fs/promises';import path from 'node:path';import {parse} from 'parse5';
import {refineHtml} from './homepage-refinement-core.mjs';
const root=path.resolve(import.meta.dirname,'..'),profile=JSON.parse(await fs.readFile(path.join(root,'homepage-presentation.json'),'utf8'));
const exists=f=>fs.access(f).then(()=>true,()=>false);
const out=path.join(root,await exists(path.join(root,'dist/client/index.html'))?'dist/client':'dist');
async function files(dir,prefix=''){let list=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.isSymbolicLink())throw Error('Unexpected build symlink');if(e.isDirectory())list.push(...await files(path.join(dir,e.name),prefix+e.name+'/'));else if(e.name.endsWith('.html'))list.push(prefix+e.name);}return list;}
let pages=0,edits=0;for(const file of await files(out)){const target=path.join(out,file),html=await fs.readFile(target,'utf8');if(!/<html\b/i.test(html))continue;const r=refineHtml(html,profile,parse,{home:/^(?:[a-z]{2}(?:-[a-zA-Z]{2,4})?\/)?index\.html$/.test(file)});if(r.html!==html){await fs.writeFile(target,r.html);pages++;edits+=r.edits.length;}}
console.log(profile.domain+': static presentation refined on '+pages+' pages ('+edits+' bounded edits); article bodies and release rules unchanged.');
