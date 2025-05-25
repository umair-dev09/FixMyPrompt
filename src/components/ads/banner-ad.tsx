
'use client';

import React, { useEffect } from 'react';

interface BannerAdProps {
  adClient?: string; // e.g., "ca-pub-4803528052284969"
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
  }, [adSlot]); // Re-run if adSlot changes, though typically it won't

  // Ensure adClient and adSlot are provided
  if (!adClient) {
    console.warn("AdClient not provided for BannerAd component. Ensure NEXT_PUBLIC_ADSENSE_PUBLISHER_ID is set in .env");
    return <div className={className} style={{ ...style, minHeight: '50px', background: '#f0f0f0', textAlign: 'center', paddingTop: '10px' }}>Ad Placeholder (Check Publisher ID in .env)</div>;
  }
  if (!adSlot || adSlot.startsWith("YOUR_AD_SLOT_ID")) {
    console.warn("AdSlot not provided or is a placeholder for BannerAd component. Ensure you have replaced placeholder Slot IDs.");
    return <div className={className} style={{ ...style, minHeight: '50px', background: '#f0f0f0', textAlign: 'center', paddingTop: '10px' }}>Ad Placeholder (Check AdSlot ID)</div>;
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
