// Surgical static-HTML edits. Used after localization and before release snapshots.
// No client-side rewriting, content generation, route changes or publication logic.
export const marker='<!-- homepage-presentation:20261025 -->';
export const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value||'';
export const text=n=>n.nodeName==='#text'?n.value:['script','style','noscript'].includes(n.tagName)?'':(n.childNodes||[]).map(text).join('');
export const all=(n,p)=>[...(p(n)?[n]:[]),...(n.childNodes||[]).flatMap(c=>all(c,p))];
export const has=(n,c)=>attr(n,'class').split(/\s+/).includes(c);
export const clean=s=>s.replace(/\s+/g,' ').trim();
const inside=(n,tag)=>{for(let p=n.parentNode;p;p=p.parentNode)if(p.tagName===tag)return p;return null;};
const panels=n=>['source-strip','sources','evidence-section'].some(c=>has(n,c));
function external(a,profile){let u;try{u=new URL(attr(a,'href'),'https://'+profile.domain);}catch{return false;}return /^https?:$/.test(u.protocol)&&u.hostname.replace(/^www\./,'')!==profile.domain&&!profile.promotionalUrls.includes(u.href);}
export function refineHtml(html,profile,parse,{home=false}={}){
 if(html.includes(marker))return{html,edits:[],alreadyRefined:true};
 const doc=parse(html,{sourceCodeLocationInfo:true}),changes=[],lang=attr(all(doc,n=>n.tagName==='html')[0]||{},'lang');
 const add=(n,next,reason)=>{const l=n.sourceCodeLocation;if(!l||l.endOffset==null)throw Error('Missing HTML span for '+reason);changes.push({start:l.startOffset,end:l.endOffset,next,reason,text:clean(text(n)).slice(0,160)});};
 const fragment=n=>html.slice(n.sourceCodeLocation.startOffset,n.sourceCodeLocation.endOffset);
 const footer=all(doc,n=>n.tagName==='footer')[0];
 if(footer&&profile.footerRemoveIndices.length){const ps=all(footer,n=>n.tagName==='p');
  if(!Array.isArray(profile.footerRemoveTexts))throw Error('Missing reviewed multilingual footer text allowlist');
  for(const p of ps.filter(p=>profile.footerRemoveTexts.includes(clean(text(p))))){const keep=all(p,n=>n.tagName==='a'&&profile.promotionalUrls.includes(attr(n,'href'))).map(fragment).join(' ');add(p,keep?'<p>'+keep+'</p>':'','remove-redundant-promotion-copy');}
 }
 if(footer)for(const a of all(footer,n=>n.tagName==='a'&&external(n,profile))){let node=a;if(a.parentNode?.tagName==='li'&&clean(text(a.parentNode))===clean(text(a)))node=a.parentNode;add(node,'','remove-footer-provider-link');}
 if(home){const main=all(doc,n=>n.tagName==='main')[0];if(!main)throw Error('Missing homepage main');
  for(const n of all(main,panels))add(n,'','remove-homepage-source-panel');
  for(const a of all(main,n=>n.tagName==='a'&&external(n,profile))){
   const p=inside(a,'p'),heading=inside(a,'h1')||inside(a,'h2')||inside(a,'h3');
   if(p&&clean(text(p))===clean(text(a))){add(p,'','remove-standalone-citation');continue;}
   if(!p&&!heading&&!all(a,n=>n.tagName==='img').length){add(a,'','remove-standalone-provider-link');continue;}
   const l=a.sourceCodeLocation;if(!l?.startTag||!l.endTag)throw Error('Unclosed homepage anchor');changes.push({start:l.startTag.startOffset,end:l.startTag.endOffset,next:'',reason:'retain-text-without-inline-provider-link',text:clean(text(a)).slice(0,100)},{start:l.endTag.startOffset,end:l.endTag.endOffset,next:'',reason:'unwrap-provider-anchor-end'});
  }
  if(profile.layout)for(const br of all(main,n=>n.tagName==='br')){let p=br.parentNode;while(p&&p!==main){if(['h1','h2'].includes(p.tagName)||has(p,'lead')||has(p,'lede')){add(br,' ','remove-forced-heading-break');break;}p=p.parentNode;}}
 }
 // Prefer an outer deletion over edits of its descendants; refuse other overlaps.
 const ordered=changes.sort((a,b)=>a.start-b.start||b.end-a.end),kept=[];
 for(const c of ordered){const prev=kept.at(-1);if(prev&&c.start>=prev.start&&c.end<=prev.end)continue;if(prev&&c.start<prev.end)throw Error('Overlapping HTML refinement');kept.push(c);}
 const head=all(doc,n=>n.tagName==='head')[0];if(!head?.sourceCodeLocation?.endTag)throw Error('Missing head');const end=head.sourceCodeLocation.endTag.startOffset;
 kept.push({start:end,end,next:marker+(home&&profile.layout?'<link rel="stylesheet" href="/homepage-refinements.css">':''),reason:'record-static-presentation-revision'});
 for(const c of kept.sort((a,b)=>b.start-a.start))html=html.slice(0,c.start)+c.next+html.slice(c.end);
 return{html,edits:kept.map(({start,end,reason,text})=>({start,end,reason,text}))};
}
