import { useState, useEffect, useRef } from 'react';

// Time allocation per step in seconds
// 60-minute session: Section 1 reading (10 min) and Section 2 case video (5 min)
// happen outside the app. In-app: interactive case study = 45 min.
export const STEP_TIME_LIMITS: Record<number, number> = {
  2: 6 * 60,   // Evidence: 6 min
  3: 7 * 60,   // Diagnose: 7 min
  4: 10 * 60,  // System Map: 10 min
  5: 12 * 60,  // Build: 12 min
  6: 10 * 60,  // Test: 10 min
};

export const TOTAL_TIME = 45 * 60; // in-app time in seconds

export const FIRST_STEP = 2;
export const LAST_TIMED_STEP = 6;

export const STEP_LABELS: Record<number, string> = {
  2: 'Evidence',
  3: 'Diagnose',
  4: 'System Map',
  5: 'Build',
  6: 'Test',
};

export function getStepTimeLimit(step: number): number {
  return STEP_TIME_LIMITS[step] ?? 0;
}

export function useActivityTimer(currentStep: number) {
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [stepElapsed, setStepElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const stepStartRef = useRef(0);

  useEffect(() => {
    setIsRunning(currentStep >= FIRST_STEP && currentStep <= LAST_TIMED_STEP);
  }, [currentStep]);

  // Reset step elapsed when step changes
  useEffect(() => {
    setStepElapsed(0);
    stepStartRef.current = totalElapsed;
  }, [currentStep]);

  // Tick
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTotalElapsed(prev => prev + 1);
      setStepElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const totalRemaining = Math.max(0, TOTAL_TIME - totalElapsed);
  const stepLimit = getStepTimeLimit(currentStep);
  const stepRemaining = Math.max(0, stepLimit - stepElapsed);

  return {
    totalElapsed,
    totalRemaining,
    stepElapsed,
    stepRemaining,
    stepLimit,
    isRunning,
    isOvertime: totalElapsed > TOTAL_TIME,
    isStepOvertime: stepElapsed > stepLimit,
  };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
