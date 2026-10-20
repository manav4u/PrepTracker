export const readingCss=`.reading-nav{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 24px;border-bottom:1px solid rgba(20,20,25,.10)}
.reading-nav .brand{display:flex;align-items:center;gap:9px;font:700 17px 'Satoshi','Space Grotesk',sans-serif;letter-spacing:-.02em;color:#141419;text-decoration:none}
.reading-nav .brand img{width:22px;height:22px;display:block}
.reading-nav .links{display:flex;gap:6px;flex-wrap:wrap}
.reading-nav .links a{font:10.5px 'Space Mono',monospace;letter-spacing:.16em;text-transform:uppercase;color:#5A5A66;text-decoration:none;padding:8px 13px;border-radius:999px;transition:color .2s,background .2s}
.reading-nav .links a:hover{color:#141419;background:rgba(20,20,25,.06)}
.reading-tools{display:flex;gap:10px;justify-content:flex-end;max-width:840px;margin:18px auto 0;padding:0 20px}
.reading-tools button{border:1px solid rgba(20,20,25,.14);background:#fff;color:#141419;padding:10px 16px;min-height:40px;border-radius:999px;font:10.5px 'Space Mono',monospace;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:border-color .2s,color .2s}
.reading-tools button:hover{border-color:#D61A40;color:#D61A40}
.reading-mode .chips:not(.tp),.reading-mode .stats,.reading-mode .motif,.reading-mode .upills{display:none}
.reading-mode main{max-width:720px}
.reading-mode .card{box-shadow:none}
.reading-mode .outline li,.reading-mode .utext{font-size:17px;line-height:1.85}
.reading-mode .unit{scroll-margin-top:15px}
.reading-mode .tp{display:block}
.reading-mode .tp .chip{display:block;font-size:15px;line-height:1.7;padding:10px 0;border:0;border-bottom:1px solid rgba(20,20,25,.10);border-radius:0;background:none}
@media(max-width:420px){main{padding:28px 18px 64px}.card{padding:18px 16px}.units{padding-left:16px}.unit:before{left:-19px}.reading-nav{padding:14px 18px}.reading-nav .links{gap:2px}.reading-nav .links a{font-size:9px;padding:7px 9px}.reading-tools{padding:0 18px}.uh h3{min-width:100%;order:3}.stat{padding:18px 8px}.stat b{font-size:44px;letter-spacing:-1px}.lead{font-size:15px}h1{font-size:32px}h2{font-size:25px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{animation:none!important;transition:none!important}}
@media print{body,html{background:#fff;color:#111}.reading-nav,.reading-tools,.upills,.cta{display:none}.card,.tw,.sc,.eq,.draft{background:#fff;box-shadow:none;color:#111;border-color:#aaa}h1,h2,h3,.stat b,.outline li,.utext,.co li,a,summary{color:#111!important}details>*{display:block!important}main{max-width:none;padding:0}.card{break-inside:avoid}}`;
export const readingChrome=`<nav class="reading-nav" aria-label="PrepTracker navigation"><a class="brand" href="/"><img src="/logo.svg" alt="" width="22" height="22">PrepTracker</a><div class="links"><a href="/#/directory">Syllabus library</a><a href="/#/">Study desk</a></div></nav><div class="reading-tools"><button id="reading-mode" type="button" aria-pressed="false">Quiet reading</button><button id="reading-print" type="button">Print page ↗</button></div>`;
export const readingScript=`(()=>{const toggle=document.getElementById('reading-mode');toggle?.addEventListener('click',()=>{const on=document.body.classList.toggle('reading-mode');toggle.setAttribute('aria-pressed',String(on));toggle.textContent=on?'Full reference view':'Quiet reading'});document.getElementById('reading-print')?.addEventListener('click',()=>window.print())})()`;
