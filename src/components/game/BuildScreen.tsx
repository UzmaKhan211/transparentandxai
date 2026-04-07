import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Wrench, Eye } from 'lucide-react';
import { EXPLANATION_OPTIONS, generatePreview, GameState } from './GameState';
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto px-4">
      <button
        onClick={() => { sfx.navigate(); onGoToStep(3); }}
        className="btn-outline-game flex items-center gap-2 text-sm mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Diagnosis
      </button>
      <div className="flex items-center gap-2 mb-2">
        <Wrench className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Build the Explanation</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Redesign the message Emily will receive. Choose up to <strong className="text-foreground">5 elements</strong> to include.
        <span className="text-primary font-mono ml-2">{state.selectedElements.length}/5 selected</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Options */}
        <div className="space-y-2">
          <p className="section-label mb-2">Available Elements</p>
          {EXPLANATION_OPTIONS.map(opt => {
            const selected = state.selectedElements.includes(opt.id);
            const disabled = !selected && state.selectedElements.length >= 5;
            return (
              <div
                key={opt.id}
                onClick={() => !disabled && toggleElement(opt.id)}
                className={`checkbox-option flex items-center gap-3 ${selected ? 'selected' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${
                  selected ? 'bg-primary border-primary' : 'border-muted-foreground'
                }`}>
                  {selected && <span className="text-primary-foreground text-xs">✓</span>}
                </div>
                <span className="text-sm">{opt.label}</span>
              </div>
            );
          })}
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-4 self-start">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-primary" />
            <p className="section-label">This is what Emily will see</p>
          </div>
          <div className="live-preview min-h-[200px]">
            {preview ? (
              <motion.div
                key={state.selectedElements.join(',')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <p className="font-semibold text-sm text-foreground">Dear Emily,</p>
                {preview.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-sm text-secondary-foreground leading-relaxed">{paragraph}</p>
                ))}
                <p className="text-sm text-muted-foreground mt-4">— Credix Support Team</p>
              </motion.div>
            ) : (
              <p className="text-muted-foreground text-sm italic">Select elements on the left to build the explanation...</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`btn-mission flex items-center gap-2 ${!canProceed ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Test Your Design
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default BuildScreen;
