import {createRequire} from "node:module";
import {readdirSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const require=createRequire(import.meta.url);
const {chromium}=require("C:/Users/zande/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const out=path.join(root,"dist","client");
const files=[];
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.name.endsWith("index.html"))files.push(full);}}
walk(out);
const routes=files.map(file=>{const rel=path.relative(out,file).replaceAll("\\","/");return rel==="index.html"?"/":`/${rel.slice(0,-11)}/`;}).sort();
if(routes.length!==120)throw Error(`Expected 120 indexable routes, found ${routes.length}`);
const browser=await chromium.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true});
const failures=[];
let checked=0;
try{
  for(const width of [390,1280]){
    const context=await browser.newContext({viewport:{width,height:844}});
    const page=await context.newPage();
    for(const route of routes){
      const response=await page.goto(`http://127.0.0.1:4323${route}`,{waitUntil:"domcontentloaded",timeout:15000});
      if(response?.status()!==200){failures.push(`${width} ${route}: HTTP ${response?.status()}`);continue;}
      const result=await page.evaluate(()=>{
        const h1=document.querySelector("h1");
        const overflow=document.documentElement.scrollWidth-window.innerWidth;
        const sections=[...document.querySelectorAll("main section")].filter(el=>el.getBoundingClientRect().height===0).length;
        return {overflow,h1:h1?.textContent?.trim()||"",sections};
      });
      if(result.overflow>1)failures.push(`${width} ${route}: horizontal overflow ${result.overflow}px`);
      if(!result.h1)failures.push(`${width} ${route}: missing rendered H1`);
      if(result.sections)failures.push(`${width} ${route}: ${result.sections} zero-height sections`);
      checked++;
    }
    await context.close();
  }
}finally{await browser.close();}
if(failures.length){console.error(`Layout audit failed (${checked} checked):\n${failures.join("\n")}`);process.exit(1);}
console.log(`Layout audit passed: ${checked}/240 desktop/mobile pages, no viewport overflow or empty sections.`);
