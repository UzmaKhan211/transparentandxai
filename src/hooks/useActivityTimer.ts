import { useState, useEffect } from 'react';

// 60-minute session: Section 1 reading (10 min) and Section 2 case video (5 min)
// happen outside the app. In-app: one shared 45-min clock for the whole case study.
// Students spend as long as they like on each step until the total runs out.
export const TOTAL_TIME = 45 * 60; // seconds

export const FIRST_STEP = 2;
export const LAST_TIMED_STEP = 6;

export function useActivityTimer(currentStep: number) {
  const [totalElapsed, setTotalElapsed] = useState(0);
  const isRunning = currentStep >= FIRST_STEP && currentStep <= LAST_TIMED_STEP;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setTotalElapsed(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  return {
    totalElapsed,
    totalRemaining: Math.max(0, TOTAL_TIME - totalElapsed),
    isRunning,
    isTimeUp: totalElapsed >= TOTAL_TIME,
  };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
