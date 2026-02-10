/**
 * HIPAA Auto-Logoff Hook (164.312(a)(2)(iii))
 *
 * Client-side inactivity detection. The server enforces the real timeout;
 * this provides a better UX by showing a warning before the session expires.
 */

import { useEffect, useRef, useState, useCallback } from "react";

const INACTIVITY_WARNING_MS = 13 * 60 * 1000; // 13 min -- show warning
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 min -- auto-logoff

const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

interface UseInactivityTimerOptions {
  onWarning: () => void;
  onTimeout: () => void;
  warningMs?: number;
  timeoutMs?: number;
  enabled?: boolean;
}

export function useInactivityTimer({
  onWarning,
  onTimeout,
  warningMs = INACTIVITY_WARNING_MS,
  timeoutMs = INACTIVITY_TIMEOUT_MS,
  enabled = true,
}: UseInactivityTimerOptions) {
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const clearTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
  }, []);

  const resetTimers = useCallback(() => {
    if (!enabled) return;
    clearTimers();
    setShowWarning(false);

    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      onWarning();
    }, warningMs);

    timeoutTimerRef.current = setTimeout(() => {
      onTimeout();
    }, timeoutMs);
  }, [enabled, warningMs, timeoutMs, onWarning, onTimeout, clearTimers]);

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    if (!enabled) return;

    resetTimers();

    const handleActivity = () => {
      if (!showWarning) {
        resetTimers();
      }
    };

    for (const event of ACTIVITY_EVENTS) {
      document.addEventListener(event, handleActivity, { passive: true });
    }

    return () => {
      clearTimers();
      for (const event of ACTIVITY_EVENTS) {
        document.removeEventListener(event, handleActivity);
      }
    };
  }, [enabled, resetTimers, clearTimers, showWarning]);

  return { showWarning, dismissWarning, resetTimers };
}
