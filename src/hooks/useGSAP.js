import { useEffect, useRef } from 'react';

export const useGSAP = (callback, dependencies = []) => {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap && typeof window.gsap.context === 'function') {
      const ctx = window.gsap.context(() => {
        if (ref.current) {
          callback(ref.current);
        } else {
          callback();
        }
      }, ref.current || undefined);

      return () => ctx.revert();
    } else if (typeof window !== 'undefined' && window.gsap) {
      console.warn("GSAP context not available, animations might not be scoped correctly. Ensure GSAP version is 3.9.0 or higher.");
      callback(ref.current || undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
};

export const initializeGSAP = () => {
  if (typeof window !== 'undefined' && window.gsap) {
    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }
    
    if (window.ScrollSmoother && document.querySelector('#smooth-wrapper') && document.querySelector('#smooth-content')) {
      try {
        window.ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 1.2, // Adjusted smoothness
          effects: true,
          smoothTouch: 0.1, 
        });
      } catch (e) {
        console.error("Failed to initialize ScrollSmoother:", e);
      }
    }
  }
};