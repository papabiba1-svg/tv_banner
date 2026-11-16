/**
 * Service to prevent Android / Fire TV (Downloader, Silk, WebViews) from entering sleep mode.
 * 
 * Combines:
 * 1. Native W3C Screen Wake Lock API (`navigator.wakeLock.request('screen')`)
 * 2. Auto-reacquisition on `visibilitychange`, `fullscreenchange`, `focus`, and remote control keys
 * 3. Silent cyclical audio loop fallback for older WebViews / Android devices where Wake Lock API is blocked
 * 4. Micro-heartbeat timer to keep the Chromium / WebView rendering engine active
 */

// 100-sample 8kHz 16-bit PCM Mono Silent WAV Data URI
const SILENT_WAV_BASE64 =
  'data:audio/wav;base64,UklGRuwAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YcgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

let wakeLockSentinel: any = null;
let fallbackAudioEl: HTMLAudioElement | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let isInitialized = false;

/**
 * Check if the W3C Screen Wake Lock API is supported by the current browser/WebView
 */
export function isWakeLockSupported(): boolean {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
}

/**
 * Request the native screen wake lock
 */
export async function requestScreenWakeLock(): Promise<boolean> {
  if (!isWakeLockSupported()) {
    triggerFallbackKeepAlive();
    return false;
  }

  try {
    if (!wakeLockSentinel || wakeLockSentinel.released) {
      wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
      
      wakeLockSentinel.addEventListener('release', () => {
        wakeLockSentinel = null;
      });
    }
    return true;
  } catch (err) {
    // Wake lock might be rejected if device is in battery saver mode or tab is hidden
    triggerFallbackKeepAlive();
    return false;
  }
}

/**
 * Release the native screen wake lock
 */
export async function releaseScreenWakeLock(): Promise<void> {
  try {
    if (wakeLockSentinel && !wakeLockSentinel.released) {
      await wakeLockSentinel.release();
    }
  } catch {
    // Ignore release errors
  } finally {
    wakeLockSentinel = null;
  }
}

/**
 * Fallback mechanism for TV devices without Wake Lock API or where it is blocked:
 * Plays an invisible, inaudible, looping silent audio track to keep Android MediaSession active
 */
function triggerFallbackKeepAlive(): void {
  if (typeof document === 'undefined') return;

  try {
    if (!fallbackAudioEl) {
      fallbackAudioEl = document.createElement('audio');
      fallbackAudioEl.id = 'tv-wake-lock-audio-fallback';
      fallbackAudioEl.setAttribute('aria-hidden', 'true');
      fallbackAudioEl.setAttribute('playsinline', '');
      fallbackAudioEl.setAttribute('muted', '');
      fallbackAudioEl.muted = true;
      fallbackAudioEl.loop = true;
      fallbackAudioEl.src = SILENT_WAV_BASE64;

      // Ensure zero visual footprint
      fallbackAudioEl.style.position = 'fixed';
      fallbackAudioEl.style.width = '1px';
      fallbackAudioEl.style.height = '1px';
      fallbackAudioEl.style.opacity = '0.001';
      fallbackAudioEl.style.pointerEvents = 'none';
      fallbackAudioEl.style.left = '-9999px';
      fallbackAudioEl.style.top = '-9999px';

      document.body.appendChild(fallbackAudioEl);
    }

    if (fallbackAudioEl.paused) {
      const playPromise = fallbackAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // In case of autoplay policy, user interaction handlers will retry
        });
      }
    }
  } catch {
    // Ignore audio initialization errors
  }
}

/**
 * Initialize the full Keep-Alive / Wake Lock system for TV kiosk mode.
 * Returns an unmount/cleanup function.
 */
export function initScreenWakeLock(): () => void {
  if (isInitialized) {
    // Re-request if already active
    requestScreenWakeLock();
    return () => {};
  }
  isInitialized = true;

  // 1. Initial Wake Lock request
  requestScreenWakeLock();

  // 2. Also start audio keep-alive as dual-layer defense for TV boxes
  triggerFallbackKeepAlive();

  // 3. Automatically re-acquire lock when document becomes visible again
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible') {
      await requestScreenWakeLock();
      triggerFallbackKeepAlive();
    }
  };

  // 4. Re-request lock on fullscreen toggle (common on TV apps)
  const handleFullscreenChange = async () => {
    await requestScreenWakeLock();
  };

  // 5. Re-request on user/remote interaction (useful if initial autoplay policy blocked audio or lock)
  const handleUserInteraction = () => {
    if (!wakeLockSentinel || wakeLockSentinel.released) {
      requestScreenWakeLock();
    }
    if (fallbackAudioEl && fallbackAudioEl.paused) {
      triggerFallbackKeepAlive();
    }
  };

  // 6. Micro-heartbeat ping timer (every 20 seconds) to ensure the runtime stays awake
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = setInterval(async () => {
    if (document.visibilityState === 'visible') {
      if (!wakeLockSentinel || wakeLockSentinel.released) {
        await requestScreenWakeLock();
      }
      if (fallbackAudioEl && fallbackAudioEl.paused) {
        triggerFallbackKeepAlive();
      }
    }
    // Lightweight heartbeat event to prevent WebView freeze
    window.dispatchEvent(new CustomEvent('tv:keepalive', { detail: { timestamp: Date.now() } }));
  }, 20000);

  // Attach event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  window.addEventListener('focus', handleVisibilityChange);
  window.addEventListener('keydown', handleUserInteraction, { passive: true });
  window.addEventListener('pointerdown', handleUserInteraction, { passive: true });
  window.addEventListener('touchstart', handleUserInteraction, { passive: true });

  // Cleanup handler
  return () => {
    isInitialized = false;
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    window.removeEventListener('focus', handleVisibilityChange);
    window.removeEventListener('keydown', handleUserInteraction);
    window.removeEventListener('pointerdown', handleUserInteraction);
    window.removeEventListener('touchstart', handleUserInteraction);

    releaseScreenWakeLock();

    if (fallbackAudioEl && fallbackAudioEl.parentNode) {
      fallbackAudioEl.parentNode.removeChild(fallbackAudioEl);
      fallbackAudioEl = null;
    }
  };
}
