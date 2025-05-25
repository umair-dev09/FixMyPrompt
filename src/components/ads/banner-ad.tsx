
'use client';

import React, { useEffect, useRef } from 'react'; // Added useRef

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
  const insRef = useRef<HTMLModElement>(null); // Use HTMLModElement for <ins>

  useEffect(() => {
    // Check if the ad slot has already been filled.
    // AdSense typically adds a 'data-ad-status="filled"' attribute.
    if (insRef.current && insRef.current.getAttribute('data-ad-status') === 'filled') {
      // console.log(`Ad slot ${adSlot} already filled, skipping push.`);
      return;
    }

    try {
      // Ensure adsbygoogle array is initialized on window
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error(`AdSense error for slot ${adSlot}: `, e);
    }
  }, [adSlot]); // Re-run if adSlot changes

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
        ref={insRef} // Attach the ref
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
        key={adSlot} // Add key to help React identify the element
      ></ins>
    </div>
  );
};

export default BannerAd;
