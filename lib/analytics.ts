// Google Analytics 4 loader with Consent Mode v2.
// Default is denied: GA loads but stores nothing and sends only cookieless
// pings until the visitor accepts on the consent banner. The choice is shared
// with the static syllabus pages via the pt_ga_consent localStorage key.
//
// Measurement ID comes from VITE_GA_MEASUREMENT_ID so each deployment can use
// its own GA4 property. Production (GitHub Pages build, no env) falls back to
// the production property; the Vercel redesign-preview project sets
// VITE_GA_MEASUREMENT_ID to its own property so preview traffic never mixes
// into production stats.
const PRODUCTION_MEASUREMENT_ID = 'G-PWDXVCDCP8';
export const GA_CONSENT_KEY = 'pt_ga_consent';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function push(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...a: unknown[]) => { window.dataLayer!.push(a); });
  window.gtag(...args);
}

export function readAnalyticsConsent(): 'granted' | 'denied' | null {
  try {
    const v = localStorage.getItem(GA_CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function setAnalyticsConsent(granted: boolean): void {
  try {
    localStorage.setItem(GA_CONSENT_KEY, granted ? 'granted' : 'denied');
  } catch { /* storage blocked: choice applies to this page only */ }
  push('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
}

export function initAnalytics(): void {
  const id =
    (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || PRODUCTION_MEASUREMENT_ID;
  if (!/^G-[A-Z0-9]+$/.test(id)) return;

  push('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  if (readAnalyticsConsent() === 'granted') {
    push('consent', 'update', { analytics_storage: 'granted' });
  }

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  push('js', new Date());
  push('config', id);
}
