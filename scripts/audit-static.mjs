import {existsSync,readdirSync,readFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const out=path.join(root,"dist","client");
const origin="https://musebox.fun";
const locales={es:"es",ja:"ja",ko:"ko","zh-hant":"zh-Hant","pt-br":"pt-BR",ru:"ru",de:"de",fr:"fr",ar:"ar"};
const articleKeys=["playbox-ai","runway","kling-ai","pika","luma-dream-machine"];
const expectedSourceHost={"playbox-ai":"playbox.website",runway:"runwayml.com","kling-ai":"kling.ai",pika:"pika.art","luma-dream-machine":"lumalabs.ai"};
const pages=new Set(["/","/blog/","/about/","/contact/","/editorial-policy/","/privacy/","/terms/",...articleKeys.map(key=>`/blog/musebox-ai-vs-${key}/`)]);
const scheduled=JSON.parse(readFileSync(path.join(root,'src/data/editorialSchedule.json'),'utf8'));
const englishOnly=new Set(scheduled.articles.filter(a=>a.approved&&existsSync(path.join(root,'src/content/blog',a.slug+'.md'))).map(a=>'/blog/'+a.slug+'/'));
for(const route of englishOnly)pages.add(route);
const failures=[];
const check=(ok,message)=>{if(!ok)failures.push(message);};
const files=[];
function walk(dir){for(const item of readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,item.name);if(item.isDirectory())walk(full);else if(item.name.endsWith(".html"))files.push(full);}}
function routeFromFile(file){const rel=path.relative(out,file).replaceAll("\\","/");return rel==="index.html"?"/":rel.endsWith("/index.html")?`/${rel.slice(0,-11)}/`:`/${rel}`;}
function localFile(href){const route=href.split("#")[0].split("?")[0];if(!route.startsWith("/"))return null;if(route==="/")return path.join(out,"index.html");return path.extname(route)?path.join(out,route):path.join(out,route,"index.html");}
function extract(html,re){return html.match(re)?.[1]??"";}
function englishPath(route){const first=route.split("/")[1];return locales[first]?route.slice(first.length+1)||"/":route;}
function expectedAlternates(route){const en=englishPath(route);return new Map([["en",`${origin}${en}`],...(englishOnly.has(en)?[]:Object.entries(locales).map(([slug,code])=>[code,`${origin}/${slug}${en}`])),["x-default",`${origin}${en}`]]);}

walk(out);
const canonicals=new Map();
for(const file of files){
  const route=routeFromFile(file),html=readFileSync(file,"utf8"),slug=route.split("/")[1];
  const lang=locales[slug]??"en";
  const title=extract(html,/<title>(.*?)<\/title>/i);
  const description=extract(html,/<meta name="description" content="([^"]+)"/i);
  const canonical=extract(html,/<link rel="canonical" href="([^"]+)"/i);
  const htmlLang=extract(html,/<html[^>]+lang="([^"]+)"/i);
  const direction=extract(html,/<html[^>]+dir="([^"]+)"/i);
  const h1=(html.match(/<h1(?:\s|>)/gi)??[]).length;
  const lowerBound=["ja","ko","zh-Hant"].includes(lang)?25:45;
  check(Boolean(title),`${route}: missing title`);
  check(description.length>=lowerBound&&description.length<=240,`${route}: description length ${description.length}`);
  if(route!=="/404.html")check(canonical===`${origin}${route}`,`${route}: canonical ${canonical}`);
  check(htmlLang===lang,`${route}: html lang ${htmlLang}`);
  check(direction===(lang==="ar"?"rtl":"ltr"),`${route}: direction ${direction}`);
  check(h1===1,`${route}: H1 count ${h1}`);
  check(/<meta name="robots"/.test(html),`${route}: robots`);
  check(/<meta property="og:title"/.test(html)&&/<meta property="og:image"/.test(html)&&/<meta name="twitter:card"/.test(html),`${route}: social metadata`);
  if(canonical){check(!canonicals.has(canonical),`${route}: duplicate canonical`);canonicals.set(canonical,route);}
  for(const img of html.match(/<img\b[^>]*>/gi)??[])check(/\salt="[^"]+"/i.test(img),`${route}: image alt`);
  for(const [,href] of html.matchAll(/href="([^"]+)"/gi)){const filePath=localFile(href);if(filePath)check(existsSync(filePath),`${route}: broken internal link ${href}`);}
  if(route==="/404.html")check(/noindex/i.test(html),"404 must be noindex");
  if(pages.has(englishPath(route))){
    const found=new Map([...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g)].map(([,code,href])=>[code,href]));
    const expected=expectedAlternates(route);
    check(found.size===expected.size,`${route}: alternate count ${found.size}`);
    for(const [code,href] of expected)check(found.get(code)===href,`${route}: ${code} alternate`);
  }
  if(lang==="en"){
    const sponsor=[...html.matchAll(/<a\b[^>]*href="https:\/\/www\.playbox\.com\/\?ref=zanderzou"[^>]*>/gi)];
    check(sponsor.length>=1&&sponsor.every(([tag])=>/rel="[^"]*sponsored\b[^"]*nofollow\b[^"]*"/i.test(tag))&&html.includes("Sponsored link:"),`${route}: promotion must be marked sponsored/nofollow and disclosed`);
  }
}
check(files.length===121+englishOnly.size,`expected ${121+englishOnly.size} HTML pages, found ${files.length}`);
for(const key of articleKeys){
  const route=`/blog/musebox-ai-vs-${key}/`;
  const article=path.join(out,"blog",`musebox-ai-vs-${key}`,"index.html");
  if(!existsSync(article))continue;
  const html=readFileSync(article,"utf8");
  const sourceSection=html.match(/<section\s+class="sources"\s+id="sources">([\s\S]*?)<\/section>/i)?.[1]??"";
  const hrefs=[...sourceSection.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map(([,href])=>href);
  check(hrefs.length>=2,`${route}: expected at least two source links`);
  check(hrefs.every(href=>href.startsWith("https://")&&!href.includes("ref=zanderzou")),`${route}: source redirected or non-HTTPS`);
  check(hrefs.some(href=>new URL(href).host==="musebox.ai"),`${route}: missing direct Musebox source`);
  check(hrefs.some(href=>new URL(href).host===expectedSourceHost[key]||new URL(href).host.endsWith(`.${expectedSourceHost[key]}`)),`${route}: missing direct competitor source`);
  check(!/DIRECT ANSWER|Direct answer/i.test(html),`${route}: obsolete direct-answer block remains`);
}
const privacy=readFileSync(path.join(out,"privacy","index.html"),"utf8");
check(/href="https:\/\/policies\.google\.com\/privacy"/.test(privacy),"Privacy: Google policy link must be direct");
for(const name of ["robots.txt","sitemap-index.xml","rss.xml","llms.txt","8b4a1e639c2d47fdaf52484f05a1c927.txt"])check(existsSync(path.join(out,name)),`missing ${name}`);
if(failures.length){console.error(`SEO audit failed:\n- ${failures.join("\n- ")}`);process.exit(1);}
console.log(`SEO audit passed for ${files.length} HTML pages, 120 existing language routes and ${englishOnly.size} new English routes.`);
