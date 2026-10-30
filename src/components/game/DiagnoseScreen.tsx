import { Check, Mail } from 'lucide-react';
import StepLayout from './StepLayout';
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

  const canProceed = state.missingInfo.length > 0 && state.biggestProblem && state.freeResponse.trim().length > 0;

  const remaining = [state.missingInfo.length > 0, !!state.biggestProblem, state.freeResponse.trim().length > 0].filter(x => !x).length;

  return (
    <StepLayout
      stepNumber={2}
      title="What's wrong with the message?"
      instruction="Think about the message Emily received. Answer three quick questions."
      onBack={() => onGoToStep(2)}
      backLabel="Back to evidence"
      onNext={onNext}
      nextLabel="Next: System Map"
      nextDisabled={!canProceed}
      hint={canProceed ? 'All answered' : `${remaining} question${remaining === 1 ? '' : 's'} left`}
    >
      {/* Reminder of the original message */}
      <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4 mb-6 flex gap-3">
        <Mail className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-warning mb-1">The message Emily got</p>
          <p className="text-sm text-secondary-foreground">"Your loan application has been denied due to a high-risk rating. At this time, we are unable to approve your request."</p>
        </div>
      </div>

      <div className="space-y-5">
        <section className="question-card">
          <div className="flex gap-3 mb-4">
            <span className="question-number">1</span>
            <div>
              <p className="font-semibold">What important information is missing?</p>
              <p className="text-sm text-muted-foreground">Pick all that apply.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MISSING_OPTIONS.map(opt => {
              const on = state.missingInfo.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => { on ? sfx.deselect() : sfx.select(); toggleMissing(opt); }}
                  className={`checkbox-option text-left flex items-center gap-3 ${on ? 'selected' : ''}`}
                >
                  <span className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center ${on ? 'bg-primary border-primary' : 'border-border'}`}>
                    {on && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                  </span>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="question-card">
          <div className="flex gap-3 mb-4">
            <span className="question-number">2</span>
            <div>
              <p className="font-semibold">What is the biggest problem?</p>
              <p className="text-sm text-muted-foreground">Pick one.</p>
            </div>
          </div>
          <div className="space-y-2">
            {BIGGEST_PROBLEM_OPTIONS.map(opt => {
              const on = state.biggestProblem === opt;
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => { sfx.select(); onUpdate({ biggestProblem: opt }); }}
                  className={`checkbox-option w-full text-left flex items-center gap-3 ${on ? 'selected' : ''}`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${on ? 'border-primary' : 'border-border'}`}>
                    {on && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </span>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="question-card">
          <div className="flex gap-3 mb-4">
            <span className="question-number">3</span>
            <div>
              <p className="font-semibold">Why isn't the message helpful to Emily?</p>
              <p className="text-sm text-muted-foreground">One or two sentences is enough.</p>
            </div>
          </div>
          <textarea
            value={state.freeResponse}
            onChange={e => onUpdate({ freeResponse: e.target.value })}
            placeholder="Write your answer here..."
            rows={3}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </section>
      </div>
    </StepLayout>
  );
};

export default DiagnoseScreen;
