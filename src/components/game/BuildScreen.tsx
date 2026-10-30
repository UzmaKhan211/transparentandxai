import { motion } from 'framer-motion';
import { Eye, Check, Mail } from 'lucide-react';
import StepLayout from './StepLayout';
import { AI_LIFECYCLE_STAGES, EXPLANATION_OPTIONS, generatePreview, getLifecycleCoverage, GameState } from './GameState';
import { sfx } from '@/hooks/useSoundEffects';

interface BuildScreenProps {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
  onNext: () => void;
  onGoToStep: (step: number) => void;
}

const BuildScreen = ({ state, onUpdate, onNext, onGoToStep }: BuildScreenProps) => {
  const toggleElement = (id: string) => {
    const current = state.selectedElements;
    if (current.includes(id)) {
      onUpdate({ selectedElements: current.filter(e => e !== id) });
      sfx.deselect();
    } else if (current.length < 5) {
      onUpdate({ selectedElements: [...current, id] });
      sfx.select();
    }
  };

  const preview = generatePreview(state.selectedElements);
  const canProceed = state.selectedElements.length > 0;
  const lifecycleCoverage = getLifecycleCoverage(state.selectedElements);

  const count = state.selectedElements.length;

  return (
    <StepLayout
      stepNumber={4}
      title="Build a better explanation"
      instruction={<>Rewrite the message Emily gets. Choose up to <strong className="text-foreground">5 pieces</strong> to include — you can't have everything, so pick what matters most.</>}
      width="wide"
      onBack={() => onGoToStep(4)}
      backLabel="Back to System Map"
      onNext={onNext}
      nextLabel="Next: Test it"
      nextDisabled={!canProceed}
      hint={canProceed ? `${count} of 5 chosen` : 'Choose at least one piece'}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-6 items-start">
        {/* Options */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="section-label">Pieces you can add</p>
            <div className="flex items-center gap-1" aria-label={`${count} of 5 chosen`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i < count ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {EXPLANATION_OPTIONS.map(opt => {
              const selected = state.selectedElements.includes(opt.id);
              const disabled = !selected && count >= 5;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => !disabled && toggleElement(opt.id)}
                  disabled={disabled}
                  className={`checkbox-option w-full text-left flex items-center gap-3 ${selected ? 'selected' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <span className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center ${selected ? 'bg-primary border-primary' : 'border-border'}`}>
                    {selected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                  </span>
                  <span className="text-sm flex-1">{opt.label}</span>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap hidden lg:inline">{opt.stage.replace(' Stage', '')}</span>
                </button>
              );
            })}
          </div>
          {count >= 5 && (
            <p className="text-sm text-muted-foreground mt-3">You've used all 5. Remove one to swap it for another.</p>
          )}
        </div>

        {/* Live Preview */}
        <div className="md:sticky md:top-36">
          <p className="section-label mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            What Emily will read
          </p>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/40">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">From Credix · Your loan application</span>
            </div>
            <div className="p-5 min-h-[220px]">
              {preview ? (
                <motion.div key={state.selectedElements.join(',')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <p className="font-semibold text-sm">Dear Emily,</p>
                  {preview.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-sm text-secondary-foreground leading-relaxed">{paragraph}</p>
                  ))}
                  <p className="text-sm text-muted-foreground pt-2">— Credix Support Team</p>
                </motion.div>
              ) : (
                <p className="text-muted-foreground text-sm">Your message will appear here as you choose pieces.</p>
              )}
            </div>
            <div className="px-5 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Stages your message improves</p>
              <div className="flex flex-wrap gap-1.5">
                {AI_LIFECYCLE_STAGES.map(stage => {
                  const on = lifecycleCoverage.addressed.includes(stage);
                  return (
                    <span key={stage} className={`rounded-full px-2.5 py-1 text-xs font-medium ${on ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {on ? '✓ ' : ''}{stage.replace(' Stage', '')}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StepLayout>
  );
};

export default BuildScreen;
