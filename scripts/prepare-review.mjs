import {readFileSync,writeFileSync,mkdirSync,cpSync,rmSync} from 'node:fs';
import {resolve} from 'node:path';
// Run after build. Never edit dist or production source in place.
const output=resolve(process.argv[2]||'dist-review');
if(output===resolve('dist')||output===resolve('.'))throw Error('Review output must be separate from production dist.');
rmSync(output,{recursive:true,force:true});mkdirSync(output,{recursive:true});cpSync('dist',output,{recursive:true});
let html=readFileSync(`${output}/index.html`,'utf8');
html=html.replace(/<script[^>]*src="https:\/\/www\.googletagmanager\.com[^>]*><\/script>/g,'').replace(/<script>\s*window\.dataLayer[\s\S]*?<\/script>/g,'');
html=html.replace(/<meta name="robots"[^>]*>/g,'<meta name="robots" content="noindex, nofollow">');
if(html.includes('googletagmanager')||html.includes("gtag('config'"))throw Error('Review analytics strip failed.');
writeFileSync(`${output}/index.html`,html);
writeFileSync(`${output}/robots.txt`,'User-agent: *\nDisallow: /\n');
writeFileSync(`${output}/vercel.json`,JSON.stringify({headers:[{source:'/(.*)',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'}]}]},null,2));
console.log(`Review artifact prepared at ${output}: no analytics, noindex. Production dist unchanged.`);
