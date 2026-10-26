import React, { useEffect, useState } from 'react';
import { readAnalyticsConsent, setAnalyticsConsent } from '../lib/analytics';

// Cookie consent. Renders nothing on the server/first client pass (so the
// prerendered landing hydrates cleanly), then shows until the visitor picks.
const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);
  useEffect(() => {
    if (readAnalyticsConsent() === null) setVisible(true);
  }, []);
  // While the banner is up it must never cover page controls: the root class
  // reserves its height so bottom-anchored layouts (onboarding) lift clear.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.classList.add('consent-open');
    else root.classList.remove('consent-open');
    return () => root.classList.remove('consent-open');
  }, [visible]);
  if (!visible) return null;

  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted);
    setVisible(false);
  };

  return (
    <div className="consent-banner" role="region" aria-label="Cookie consent">
      <p className="consent-title">We use cookies</p>
      <p className="consent-copy">
        We use necessary storage to remember your study data on this device, and
        optional analytics cookies to understand how the site is used. Analytics
        stays off unless you accept. Details in the <a href="/privacy/">privacy policy</a>.
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-accept" onClick={() => choose(true)}>
          Accept
        </button>
        <button type="button" className="consent-decline" onClick={() => choose(false)}>
          Reject
        </button>
        <button type="button" className="consent-manage" onClick={() => setManaging((m) => !m)}>
          Manage
        </button>
      </div>
      {managing && (
        <div className="consent-panel">
          <div className="consent-row">
            <div>
              <b>Necessary</b>
              <span>Your study data and cookie choice, stored on this device only.</span>
            </div>
            <span className="consent-always">Always on</span>
          </div>
          <div className="consent-row">
            <div>
              <b>Analytics cookies</b>
              <span>Visit statistics: pages viewed, rough region, device type.</span>
            </div>
            <button
              type="button"
              className="consent-toggle"
              role="switch"
              aria-checked={analyticsOn}
              aria-label="Analytics cookies"
              onClick={() => setAnalyticsOn((v) => !v)}
            />
          </div>
          <div className="consent-actions">
            <button type="button" className="consent-accept" onClick={() => choose(analyticsOn)}>
              Save choices
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentBanner;
