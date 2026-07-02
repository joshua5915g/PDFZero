"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "development") {
        // Proactively unregister any active service worker during development
        // to prevent stale caching issues and hydration mismatches.
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then((success) => {
              if (success) {
                console.log("Development mode: Stale Service Worker unregistered.");
                // Reload to clean the browser cache state
                window.location.reload();
              }
            });
          }
        });
        return;
      }

      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("PWA Service Worker registered scopes: ", registration.scope);
        })
        .catch((error) => {
          console.error("PWA Service Worker registration failures: ", error);
        });
    }
  }, []);

  return null;
}
