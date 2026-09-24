import { localeList, type LocaleSlug } from "./localized-musebox";
import { site } from "./site";
import type { ComparisonKey } from "./localized-articles";

export type SiteLocale = "en" | LocaleSlug;
export const articleOrder: ComparisonKey[] = ["playbox-ai","runway","kling-ai","pika","luma-dream-machine"];
export const brandNames: Record<ComparisonKey,string> = {
  "playbox-ai":"Playbox AI", runway:"Runway", "kling-ai":"Kling AI", pika:"Pika", "luma-dream-machine":"Luma",
};
const localizedSlugs = new Set<string>(localeList.map((entry) => entry.slug));
const pagePaths = new Set(["/","/blog/","/about/","/contact/","/editorial-policy/","/privacy/","/terms/"]);
const articlePaths = new Set(articleOrder.map((key) => `/blog/musebox-ai-vs-${key}/`));

export function normalizedPath(pathname:string):string {
  const value=pathname.startsWith("/")?pathname:`/${pathname}`;
  return value.endsWith("/")?value:`${value}/`;
}
export function localeFromPath(pathname:string):SiteLocale {
  const first=normalizedPath(pathname).split("/")[1];
  return localizedSlugs.has(first)?first as LocaleSlug:"en";
}
export function englishPath(pathname:string):string {
  const path=normalizedPath(pathname);
  const locale=localeFromPath(path);
  return locale==="en"?path:normalizedPath(path.slice(locale.length+1));
}
export function localePath(locale:SiteLocale,pathname:string):string {
  const base=englishPath(pathname);
  return locale==="en"?base:`/${locale}${base}`;
}
export function isTranslatedRoute(pathname:string):boolean {
  const path=englishPath(pathname);
  return pagePaths.has(path)||articlePaths.has(path);
}
export function languageAlternates(pathname:string):{code:string;href:string}[] {
  if(!isTranslatedRoute(pathname))return [];
  const codes:SiteLocale[]=["en",...localeList.map((entry)=>entry.slug)];
  return [
    ...codes.map((code)=>({code:code==="en"?"en":localeList.find((entry)=>entry.slug===code)!.code,href:`${site.url}${localePath(code,pathname)}`})),
    {code:"x-default",href:`${site.url}${localePath("en",pathname)}`},
  ];
}
