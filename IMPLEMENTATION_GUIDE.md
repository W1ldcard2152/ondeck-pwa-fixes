# Implementation Guide for OnDeck Fixes

This guide provides step-by-step instructions for implementing the fixes to resolve the two issues:
1. Service Worker not being active (PWA not installable)
2. Tasks Table not showing up

## Step 1: Fix the Service Worker Registration

### Copy the Updated Service Worker Hook
1. Create or update `src/hooks/useServiceWorker.ts` with the enhanced version in this repo.
2. This hook handles all aspects of service worker registration, activation, and status monitoring.

### Update the InstallPWA Component
1. Replace `src/components/InstallPWA.tsx` with the updated version in this repo.
2. This component now integrates with the service worker hook and properly displays the installation button.

### Update the Desktop Layout
1. Replace `src/components/layouts/DesktopLayout.tsx` with the updated version in this repo.
2. The layout component now initializes the service worker on component mount.

### Update the PWA Status Component
1. Replace `src/components/PWAStatus.tsx` with the updated version in this repo.
2. This component now shows more accurate information about the service worker status.

### Copy the Updated Service Worker File
1. Replace `public/sw.js` with the version in `fixes/sw.js` from this repo.
2. This service worker includes improved error handling and caching strategies.

## Step 2: Fix the Tasks Table Component

1. Replace `src/components/TaskTable.tsx` with the fixed version in this repo.
2. Key changes include:
   - Added validation to ensure tasks array is valid
   - Improved error handling for missing or invalid data
   - Added proper fallback UI for when no tasks are found
   - Added debug logging to track component rendering

## Testing Your Implementation

### To Test the Service Worker / PWA Installation:
1. Build and deploy your application 
2. Open Chrome DevTools > Application > Service Workers
3. Verify the service worker shows as "active"
4. Check that the "Install" button appears when appropriate
5. Attempt to install the PWA

### To Test the Tasks Table:
1. Navigate to the Tasks page
2. Confirm the table displays correctly
3. Verify that tasks with different statuses appear in appropriate sections

## Troubleshooting

### If the Service Worker Still Isn't Active:
1. Check the browser console for any error messages
2. Verify that the service worker file is accessible at '/sw.js'
3. Check that the service worker hook is being initialized in the DesktopLayout component
4. Try clearing your browser cache and service workers, then reload

### If the Tasks Table Still Doesn't Display:
1. Check the browser console for any error messages
2. Verify that tasks are being fetched correctly (check the network tab)
3. Add a console log in the TaskTable component to confirm the tasks array is being received
4. Check for any CSS issues that might be hiding the table

## Additional Notes

- The service worker is configured to work in both development and production environments
- The TaskTable component includes additional debugging output in development mode
- The PWA status panel will only show in development mode to help with debugging
