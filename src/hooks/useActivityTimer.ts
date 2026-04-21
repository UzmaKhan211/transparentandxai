import { useState, useEffect, useCallback, useRef } from 'react';

// Time allocation per step in seconds
// Total = 35 minutes (5 min concept check + 30 min simulation)
const STEP_TIME_LIMITS: Record<number, number> = {
  0: 5 * 60,   // Concept Check: 5 min
  1: 3 * 60,   // Brief: 3 min
  2: 4 * 60,   // Evidence: 4 min
  3: 4 * 60,   // Diagnose: 4 min
  4: 5 * 60,   // System Map: 5 min
  5: 7 * 60,   // Build: 7 min
  6: 4 * 60,   // Test: 4 min
  7: 3 * 60,   // Reflect: 3 min
};

const TOTAL_TIME = 35 * 60; // 35 minutes in seconds

export const STEP_LABELS: Record<number, string> = {
  0: 'Concept Check',
  1: 'Mission Brief',
  2: 'Evidence',
  3: 'Diagnose',
  4: 'System Map',
  5: 'Build',
  6: 'Test',
  7: 'Reflect',
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
    if (currentStep >= 0 && currentStep <= 7) {
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
