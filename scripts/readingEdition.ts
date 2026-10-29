export const readingCss=`.reading-nav{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:14px;padding:14px 24px;border-bottom:1px solid rgba(20,20,25,.10)}
.reading-nav .brand{display:flex;align-items:center;gap:9px;font:700 17px 'Satoshi','Space Grotesk',sans-serif;letter-spacing:-.02em;color:#141419;text-decoration:none;margin-right:auto}
.reading-nav .brand img{width:22px;height:22px;display:block}
.reading-tools{display:flex;gap:8px;align-items:center}
.reading-tools button{border:1px solid rgba(20,20,25,.14);background:#fff;color:#141419;padding:9px 14px;min-height:38px;border-radius:999px;font:10px 'Space Mono',monospace;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:border-color .2s,color .2s;white-space:nowrap}
.reading-tools button:hover{border-color:#D61A40;color:#D61A40}
.nav-cta{display:inline-block;background:#D61A40;color:#fff!important;text-decoration:none;font:700 12.5px 'Satoshi','Space Grotesk',sans-serif;padding:10px 20px;border-radius:999px;white-space:nowrap;transition:transform .2s ease,box-shadow .2s ease}
.nav-cta:hover{transform:translateY(-1px);box-shadow:0 10px 20px -8px rgba(214,26,64,.5)}
@media(max-width:640px){.reading-nav{flex-wrap:wrap;padding:12px 18px;gap:10px}.reading-tools{order:3;flex-basis:100%;justify-content:flex-start}.reading-tools button{min-height:36px;padding:8px 13px}}
.reading-mode .chips:not(.tp),.reading-mode .stats,.reading-mode .motif,.reading-mode .upills{display:none}
.reading-mode main{max-width:720px}
.reading-mode .card{box-shadow:none}
.reading-mode .outline li,.reading-mode .utext{font-size:17px;line-height:1.85}
.reading-mode .unit{scroll-margin-top:15px}
.reading-mode .tp{display:block}
.reading-mode .tp .chip{display:block;font-size:15px;line-height:1.7;padding:10px 0;border:0;border-bottom:1px solid rgba(20,20,25,.10);border-radius:0;background:none}
@media(max-width:420px){main{padding:28px 18px 64px}.card{padding:18px 16px}.units{padding-left:16px}.unit:before{left:-19px}.uh h3{min-width:100%;order:3}.stat{padding:18px 8px}.stat b{font-size:44px;letter-spacing:-1px}.lead{font-size:15px}h1{font-size:32px}h2{font-size:25px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{animation:none!important;transition:none!important}}
@media print{body,html{background:#fff;color:#111}.reading-nav,.upills,.cta{display:none}.card,.tw,.sc,.eq,.draft{background:#fff;box-shadow:none;color:#111;border-color:#aaa}h1,h2,h3,.stat b,.outline li,.utext,.co li,a,summary{color:#111!important}details>*{display:block!important}main{max-width:none;padding:0}.card{break-inside:avoid}}`;
export const readingChrome=`<nav class="reading-nav" aria-label="PrepTracker navigation"><a class="brand" href="/"><img src="/logo.svg" alt="" width="22" height="22">PrepTracker</a><div class="reading-tools"><button id="reading-mode" type="button" aria-pressed="false">Quiet reading</button><button id="reading-print" type="button">Print page ↗</button></div><a class="nav-cta" href="/app">Open app</a></nav>`;
export const readingScript=`(()=>{const toggle=document.getElementById('reading-mode');toggle?.addEventListener('click',()=>{const on=document.body.classList.toggle('reading-mode');toggle.setAttribute('aria-pressed',String(on));toggle.textContent=on?'Full reference view':'Quiet reading'});document.getElementById('reading-print')?.addEventListener('click',()=>window.print())})()`;

export const consentCss=`.pt-consent{position:fixed;left:16px;bottom:16px;z-index:99;max-width:min(360px,calc(100vw - 32px));background:#F7F5F2;color:#141419;border:1px solid rgba(20,20,25,.14);border-radius:16px;padding:16px 16px 14px;box-shadow:0 12px 32px -12px rgba(20,20,25,.35);font-family:'Satoshi','Space Grotesk',sans-serif}
.pt-consent .c-t{margin:0 0 6px;font-weight:700;font-size:14px;letter-spacing:-.01em}
.pt-consent .c-c{margin:0;font-size:12.5px;line-height:1.55;color:rgba(20,20,25,.72)}
.pt-consent .c-c a{color:inherit}
.pt-consent .c-a{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.pt-consent button{border-radius:999px;padding:9px 16px;font:700 12px 'Satoshi','Space Grotesk',sans-serif;cursor:pointer}
.pt-consent .c-y{border:0;background:#D61A40;color:#fff}
.pt-consent .c-n{border:1px solid rgba(20,20,25,.18);background:transparent;color:rgba(20,20,25,.75)}
.pt-consent .c-m{border:0;background:none;text-decoration:underline;padding:9px 6px;color:rgba(20,20,25,.6)}
.pt-consent .c-panel{margin-top:12px;border-top:1px solid rgba(20,20,25,.14);padding-top:12px}
.pt-consent .c-row{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px}
.pt-consent .c-row b{font-size:12.5px}
.pt-consent .c-row span{display:block;color:rgba(20,20,25,.6);font-size:11px;line-height:1.5}
.pt-consent .c-on{color:rgba(20,20,25,.5);font-size:11px;white-space:nowrap}
.pt-consent .c-tog{flex:none;width:42px;height:24px;border-radius:999px;border:1px solid rgba(20,20,25,.25);background:rgba(20,20,25,.08);position:relative;cursor:pointer;padding:0}
.pt-consent .c-tog::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(20,20,25,.3);transition:left .15s}
.pt-consent .c-tog[aria-checked="true"]{background:#D61A40;border-color:#D61A40}
.pt-consent .c-tog[aria-checked="true"]::after{left:20px}`;
export const consentScript=`(function(){try{if(localStorage.getItem('pt_ga_consent')!==null)return}catch(e){}var d=document.createElement('div');d.className='pt-consent';d.setAttribute('role','region');d.setAttribute('aria-label','Cookie consent');d.innerHTML='<p class="c-t">We use cookies</p><p class="c-c">We use necessary storage to remember your study data on this device, and optional analytics cookies to understand how the site is used. Analytics stays off unless you accept. Details in the <a href="/privacy/">privacy policy</a>.</p><div class="c-a"><button type="button" class="c-y">Accept</button><button type="button" class="c-n">Reject</button><button type="button" class="c-m">Manage</button></div><div class="c-panel" hidden><div class="c-row"><div><b>Necessary</b><span>Your study data and cookie choice, stored on this device only.</span></div><span class="c-on">Always on</span></div><div class="c-row"><div><b>Analytics cookies</b><span>Visit statistics: pages viewed, rough region, device type.</span></div><button type="button" class="c-tog" role="switch" aria-checked="false" aria-label="Analytics cookies"></button></div><div class="c-a"><button type="button" class="c-y c-save">Save choices</button></div></div>';document.body.appendChild(d);function pick(g){try{localStorage.setItem('pt_ga_consent',g?'granted':'denied')}catch(e){}if(window.gtag)gtag('consent','update',{analytics_storage:g?'granted':'denied'});if(g&&window.ptStartAnalytics)ptStartAnalytics();d.remove()}var tog=d.querySelector('.c-tog');d.querySelector('.c-y:not(.c-save)').addEventListener('click',function(){pick(true)});d.querySelector('.c-n').addEventListener('click',function(){pick(false)});d.querySelector('.c-m').addEventListener('click',function(){var p=d.querySelector('.c-panel');p.hidden=!p.hidden});tog.addEventListener('click',function(){tog.setAttribute('aria-checked',tog.getAttribute('aria-checked')==='true'?'false':'true')});d.querySelector('.c-save').addEventListener('click',function(){pick(tog.getAttribute('aria-checked')==='true')})})()`;
