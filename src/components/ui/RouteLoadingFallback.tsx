import { LoadingSpinner } from './LoadingSpinner'

export function RouteLoadingFallback() {
  return (
    <div className="route-loading-fallback" role="status" aria-live="polite" aria-label="Loading page">
      <div className="route-loading-content">
        <span className="route-loading-icon" aria-hidden="true">🪐</span>
        <LoadingSpinner />
        <p className="route-loading-text">Opening ORBIS Story Studio…</p>
      </div>
    </div>
  )
}
