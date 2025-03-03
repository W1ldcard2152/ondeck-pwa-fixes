# Service Worker Integration Fix

The issue with the service worker not being active is that it needs to be properly registered within the application.

## Problem Analysis:

1. The service worker file (sw.js) exists but isn't being registered correctly
2. The PWA status panel shows "Service Worker: Inactive"
3. The registration code exists in `next-pwa-setup.js` but might not be loaded properly

## Solution:

We need to integrate the service worker registration directly into the application's core layout component to ensure it's always loaded.

## Implementation:

1. Update the DesktopLayout.tsx to register the service worker on component mount
2. Create a custom hook for service worker registration to properly handle lifecycle events

```tsx
// src/hooks/useServiceWorker.ts

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
  }, []);
  
  return { registration, isActive };
}
```

Then update the DesktopLayout.tsx component to use this hook:

```tsx
// In src/components/layouts/DesktopLayout.tsx

// Add near the top of the file with other imports
import { useServiceWorker } from '@/hooks/useServiceWorker';

// Inside the DesktopLayout component, add this line
const { isActive } = useServiceWorker();
```

This will ensure the service worker is properly registered whenever the main layout loads, which should fix the inactive service worker issue.
