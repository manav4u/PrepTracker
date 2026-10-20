// Google Analytics 4 loader.
// Measurement ID comes from VITE_GA_MEASUREMENT_ID so each deployment can use
// its own GA4 property. Production (GitHub Pages build, no env) falls back to
// the production property; the Vercel redesign-preview project sets
// VITE_GA_MEASUREMENT_ID to its own property so preview traffic never mixes
// into production stats.
const PRODUCTION_MEASUREMENT_ID = 'G-PWDXVCDCP8';

export function initAnalytics(): void {
  const id =
    (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || PRODUCTION_MEASUREMENT_ID;
  if (!/^G-[A-Z0-9]+$/.test(id)) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  function gtag(...args: unknown[]) {
    w.dataLayer.push(args);
  }
  w.gtag = w.gtag || gtag;
  w.gtag('js', new Date());
  w.gtag('config', id);
}
