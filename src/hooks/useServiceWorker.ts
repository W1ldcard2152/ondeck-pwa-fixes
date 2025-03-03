import { useEffect, useState } from 'react';

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }
    
    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        setRegistration(reg);
        
        // Check if there's an active service worker
        setIsActive(Boolean(reg.active));
        
        // Listen for controlling changes
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setIsActive(true);
        });
        
        console.log('Service worker registered successfully', reg);
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };
    
    registerSW();
    
    // Cleanup function
    return () => {
      if (registration) {
        // No need to unregister, but we can clean up event listeners if needed
      }
    };
  }, []);
  
  return { registration, isActive };
}
