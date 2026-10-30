import { useState, useEffect, useCallback, useRef } from 'react';

// Time allocation per step in seconds
// 60-minute session: Section 1 reading (10 min) happens outside the app.
// In-app: concept check (5) + case video (5) + case study steps (40) = 50 min
export const STEP_TIME_LIMITS: Record<number, number> = {
  0: 5 * 60,   // Concept Check: 5 min
  1: 5 * 60,   // Case Video: 5 min
  2: 6 * 60,   // Evidence: 6 min
  3: 7 * 60,   // Diagnose: 7 min
  4: 9 * 60,   // System Map: 9 min
  5: 10 * 60,  // Build: 10 min
  6: 8 * 60,   // Test: 8 min
};

export const TOTAL_TIME = 50 * 60; // in-app time in seconds

export const STEP_LABELS: Record<number, string> = {
  0: 'Concept Check',
  1: 'Case Video',
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

  // Start the timer when we hit step 0
  useEffect(() => {
    if (currentStep >= 0 && currentStep <= 6) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
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
