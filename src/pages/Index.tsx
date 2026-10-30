import { useState, useCallback } from 'react';
import StepIndicator from '@/components/game/StepIndicator';
import EvidenceBoard from '@/components/game/EvidenceBoard';
import DiagnoseScreen from '@/components/game/DiagnoseScreen';
import SystemMapScreen from '@/components/game/SystemMapScreen';
import BuildScreen from '@/components/game/BuildScreen';
import FeedbackScreen from '@/components/game/FeedbackScreen';
import MissionCompleteScreen from '@/components/game/MissionCompleteScreen';
import ActivityTimer from '@/components/game/ActivityTimer';
import { GameState, initialGameState } from '@/components/game/GameState';
import { useActivityTimer, FIRST_STEP, LAST_TIMED_STEP } from '@/hooks/useActivityTimer';
import { Shield } from 'lucide-react';

const Index = () => {
  // The app opens straight into the case study (Evidence Board).
  const [state, setState] = useState<GameState>({ ...initialGameState, step: FIRST_STEP });
  const timer = useActivityTimer(state.step);

  const updateState = useCallback((updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, step: Math.max(FIRST_STEP, step) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const nextStep = useCallback(() => {
    goToStep(state.step + 1);
  }, [state.step, goToStep]);

  const showHeader = state.step >= FIRST_STEP && state.step <= LAST_TIMED_STEP;

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Credix Ethics Lab</span>
              <div className="pulse-dot ml-1" />
            </div>
            <StepIndicator currentStep={state.step} />
            <ActivityTimer
              totalRemaining={timer.totalRemaining}
              stepRemaining={timer.stepRemaining}
              stepElapsed={timer.stepElapsed}
              currentStep={state.step}
              isOvertime={timer.isOvertime}
              isStepOvertime={timer.isStepOvertime}
            />
          </div>
        </header>
      )}

      <main className="py-8 pb-16">
        {state.step === 2 && <EvidenceBoard state={state} onUpdate={updateState} onNext={nextStep} />}
        {state.step === 3 && <DiagnoseScreen state={state} onUpdate={updateState} onNext={nextStep} onGoToStep={goToStep} />}
        {state.step === 4 && <SystemMapScreen state={state} onUpdate={updateState} onNext={nextStep} onGoToStep={goToStep} />}
        {state.step === 5 && <BuildScreen state={state} onUpdate={updateState} onNext={nextStep} onGoToStep={goToStep} />}
        {state.step === 6 && <FeedbackScreen state={state} onNext={nextStep} onGoToStep={goToStep} />}
        {state.step === 7 && <MissionCompleteScreen onGoToStep={goToStep} />}
      </main>
    </div>
  );
};

export default Index;
