import {chromium} from '@playwright/test';
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
await p.goto('http://127.0.0.1:5173/onboarding');await p.getByRole('region',{name:'Cookie consent'}).screenshot({path:'public/guide/consent.png',animations:'disabled'});
await b.close();
