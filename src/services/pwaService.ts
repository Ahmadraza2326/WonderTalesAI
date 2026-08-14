/**
 * Helper to register the Service Worker in production PWA environments.
 */
export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker active with scope:', registration.scope)
        })
        .catch((error) => {
          console.warn('[PWA] Service Worker registration failed:', error)
        })
    })
  }
}
