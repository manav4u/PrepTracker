import React, { useEffect, useState } from 'react';
import { readAnalyticsConsent, setAnalyticsConsent } from '../lib/analytics';

// Analytics consent. Renders nothing on the server/first client pass (so the
// prerendered landing hydrates cleanly), then shows until the visitor picks.
const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (readAnalyticsConsent() === null) setVisible(true);
  }, []);
  if (!visible) return null;

  const choose = (granted: boolean) => {
    setAnalyticsConsent(granted);
    setVisible(false);
  };

  return (
    <div className="consent-banner" role="region" aria-label="Analytics consent">
      <p className="consent-title">A quick privacy note</p>
      <p className="consent-copy">
        PrepTracker can count visits with Google Analytics to see what gets used.
        No ads, no personal data, and it only runs if you say yes.
      </p>
      <div className="consent-actions">
        <button type="button" className="consent-accept" onClick={() => choose(true)}>
          Allow stats
        </button>
        <button type="button" className="consent-decline" onClick={() => choose(false)}>
          No thanks
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
