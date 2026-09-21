# Musebox AI Video Guide

Independent Astro + Markdown publication for `musebox.fun`, focused on Musebox AI video workflow, image-to-video testing, consent, privacy, comparisons, and alternatives.

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run test:seo
npm run test:sites
```

Add articles under `src/content/blog`. Astro generates article routes, the blog index, structured data, XML sitemap, and RSS feed.

Cloudflare Pages settings:

- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist/client`
