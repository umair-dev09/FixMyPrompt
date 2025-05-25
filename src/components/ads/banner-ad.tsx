
'use client';

import React, { useEffect } from 'react';

interface BannerAdProps {
  adClient: string; // e.g., "ca-pub-4803528052284969"
  adSlot: string; // e.g., "YOUR_AD_SLOT_ID"
  adFormat?: string; // e.g., "auto", "rectangle", "vertical", "horizontal"
  responsive?: string; // "true" or "false"
  className?: string;
  style?: React.CSSProperties;
}

const BannerAd: React.FC<BannerAdProps> = ({
  adClient,
  adSlot,
  adFormat = "auto",
  responsive = "true",
  className,
  style = { display: 'block' }
}) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error: ", e);
    }
  }, []);

  // Ensure adClient and adSlot are provided, otherwise render nothing or a placeholder
  if (!adClient || !adSlot) {
    // In a real app, you might want to return null or a placeholder div
    // For development, this console warning helps.
    console.warn("AdClient or AdSlot not provided for BannerAd component. Ensure you have replaced placeholder IDs.");
    return <div className={className} style={{ ...style, minHeight: '50px', background: '#f0f0f0', textAlign: 'center', paddingTop: '10px' }}>Ad Placeholder (Check AdSlot ID)</div>;
  }
  // If a placeholder AdClient ID is detected (even if adSlot is present), show a warning.
  if (adClient === "ca-pub-YOUR_ADSENSE_PUBLISHER_ID") {
    console.warn("Placeholder AdClient ID detected. Please replace ca-pub-YOUR_ADSENSE_PUBLISHER_ID with your actual ID.");
     return <div className={className} style={{ ...style, minHeight: '50px', background: '#f0f0f0', textAlign: 'center', paddingTop: '10px' }}>Ad Placeholder (Check Publisher ID)</div>;
  }


  return (
    <div className={className} style={{ textAlign: 'center', margin: '20px 0' }}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
};

export default BannerAd;
