import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Search } from 'lucide-react';
import { GameState } from './GameState';
import { sfx } from '@/hooks/useSoundEffects';

interface DiagnoseScreenProps {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
  onNext: () => void;
  onGoToStep: (step: number) => void;
}

const MISSING_OPTIONS = [
  'Clear reasons for the decision',
  'The main factors that affected the outcome',
  'An explanation in simple language',
  'Steps the user can take to improve',
  'A way to request a review',
  'Information about what data was used',
];

const BIGGEST_PROBLEM_OPTIONS = [
  'It does not explain why the decision was made',
  'It does not tell the user what to do next',
  'It is too vague',
  'It makes the decision feel final with no options',
];

const DiagnoseScreen = ({ state, onUpdate, onNext, onGoToStep }: DiagnoseScreenProps) => {
  const toggleMissing = (option: string) => {
    const current = state.missingInfo;
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    onUpdate({ missingInfo: updated });
  };

  const canProceed = state.missingInfo.length > 0 && state.biggestProblem && state.freeResponse.trim().length > 10;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-4">
      <button
        onClick={() => { sfx.navigate(); onGoToStep(2); }}
        className="btn-outline-game flex items-center gap-2 text-sm mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Evidence
      </button>
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Diagnose the Problem</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Based on what you've seen, identify what is missing from the message Emily received.</p>

      {/* Question 1 */}
      <div className="mb-8">
        <p className="font-semibold mb-3">1. What important information is missing from the current explanation? <span className="text-muted-foreground font-normal text-sm">(Select all that apply)</span></p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MISSING_OPTIONS.map(opt => (
            <div
              key={opt}
              onClick={() => toggleMissing(opt)}
              className={`checkbox-option flex items-center gap-3 ${state.missingInfo.includes(opt) ? 'selected' : ''}`}
            >
              <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${
                state.missingInfo.includes(opt) ? 'bg-primary border-primary' : 'border-muted-foreground'
              }`}>
                {state.missingInfo.includes(opt) && <span className="text-primary-foreground text-xs">✓</span>}
              </div>
              <span className="text-sm">{opt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Question 2 */}
      <div className="mb-8">
        <p className="font-semibold mb-3">2. What is the biggest problem with the current message? <span className="text-muted-foreground font-normal text-sm">(Select one)</span></p>
        <div className="space-y-2">
          {BIGGEST_PROBLEM_OPTIONS.map(opt => (
            <div
              key={opt}
              onClick={() => onUpdate({ biggestProblem: opt })}
              className={`checkbox-option flex items-center gap-3 ${state.biggestProblem === opt ? 'selected' : ''}`}
            >
              <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                state.biggestProblem === opt ? 'bg-primary border-primary' : 'border-muted-foreground'
              }`}>
                {state.biggestProblem === opt && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
              </div>
              <span className="text-sm">{opt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Question 3 */}
      <div className="mb-8">
        <p className="font-semibold mb-3">3. In one or two sentences, explain why the current explanation is not helpful to the user.</p>
        <textarea
          value={state.freeResponse}
          onChange={e => onUpdate({ freeResponse: e.target.value })}
          placeholder="Type your response here..."
          rows={3}
          className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`btn-mission flex items-center gap-2 ${!canProceed ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Build the Explanation
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {!canProceed && (
        <p className="text-xs text-muted-foreground text-right mt-2">Answer all questions to continue</p>
      )}
    </motion.div>
  );
};

export default DiagnoseScreen;
