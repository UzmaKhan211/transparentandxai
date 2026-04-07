import { useState, useCallback } from 'react';
import StepIndicator from '@/components/game/StepIndicator';
import MissionBrief from '@/components/game/MissionBrief';
import EvidenceBoard from '@/components/game/EvidenceBoard';
import DiagnoseScreen from '@/components/game/DiagnoseScreen';
import BuildScreen from '@/components/game/BuildScreen';
import FeedbackScreen from '@/components/game/FeedbackScreen';
import ReflectScreen from '@/components/game/ReflectScreen';
import { GameState, initialGameState } from '@/components/game/GameState';
import { Shield } from 'lucide-react';

const Index = () => {
  const [state, setState] = useState<GameState>(initialGameState);

  const updateState = useCallback((updates: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, step }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const nextStep = useCallback(() => {
    goToStep(state.step + 1);
  }, [state.step, goToStep]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {state.step > 1 && (
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">Credix Ethics Lab</span>
              <div className="pulse-dot ml-1" />
            </div>
            <StepIndicator currentStep={state.step} />
          </div>
        </header>
      )}

      {/* Content */}
      <main className="py-8 pb-16">
        {state.step === 1 && <MissionBrief onNext={nextStep} />}
        {state.step === 2 && <EvidenceBoard onNext={nextStep} />}
{state.step === 3 && <DiagnoseScreen state={state} onUpdate={updateState} onNext={nextStep} onGoToStep={goToStep} />}
        {state.step === 4 && <BuildScreen state={state} onUpdate={updateState} onNext={nextStep} onGoToStep={goToStep} />}
        {state.step === 5 && <FeedbackScreen state={state} onNext={nextStep} onGoToStep={goToStep} />}
        {state.step === 6 && <ReflectScreen state={state} onUpdate={updateState} onGoToStep={goToStep} />}
      </main>
    </div>
  );
};

export default Index;
