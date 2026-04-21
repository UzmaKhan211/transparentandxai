import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Map, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { GameState } from './GameState';
import {
  SYSTEM_MAP_ISSUES,
  SYSTEM_MAP_STAGE_OPTIONS,
  SystemMapAnswer,
  SystemMapEvaluation,
  buildSystemMapFeedback,
  evaluateSystemMap,
} from './SystemMapData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sfx } from '@/hooks/useSoundEffects';

interface SystemMapScreenProps {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
  onNext: () => void;
  onGoToStep: (step: number) => void;
}

const REQUIRED_CORRECT = 3;

const SystemMapScreen = ({ state, onUpdate, onNext, onGoToStep }: SystemMapScreenProps) => {
  const answers = state.systemMapAnswers ?? {};
  const [submitted, setSubmitted] = useState(false);
  const [evals, setEvals] = useState<SystemMapEvaluation[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Reset elapsed timer when entering screen
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const allFilled = useMemo(
    () => SYSTEM_MAP_ISSUES.every(issue => answers[issue.id]?.stage && answers[issue.id]?.fixId),
    [answers]
  );

  const setAnswer = (issueId: string, patch: Partial<SystemMapAnswer>) => {
    const prev = answers[issueId] ?? { stage: '', fixId: '' };
    const updated = { ...answers, [issueId]: { ...prev, ...patch } };
    onUpdate({ systemMapAnswers: updated });
    sfx.select();
  };

  const handleSubmit = () => {
    if (!allFilled) return;
    const result = evaluateSystemMap(answers);
    setEvals(result);
    setSubmitted(true);
    sfx.submit();
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    onUpdate({
      systemMapEvaluations: result,
      systemMapTimeSpent: (state.systemMapTimeSpent ?? 0) + elapsed,
      systemMapAttempts: (state.systemMapAttempts ?? 0) + 1,
    });
  };

  const handleRetry = () => {
    setSubmitted(false);
    setEvals([]);
    sfx.click();
    startTimeRef.current = Date.now();
  };

  const correctCount = evals.filter(e => e.combinationCorrect).length;
  const canProceed = submitted && correctCount >= REQUIRED_CORRECT;
  const feedbackMessages = submitted ? buildSystemMapFeedback(evals, answers) : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4">
      <button
        onClick={() => { sfx.navigate(); onGoToStep(3); }}
        className="btn-outline-game flex items-center gap-2 text-sm mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Diagnosis
      </button>

      <div className="flex items-center gap-2 mb-2">
        <Map className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Fix the System Map</h2>
      </div>
      <p className="text-sm text-secondary-foreground mb-1">
        This system has multiple transparency issues. For each issue below, identify where it should be addressed and how it should be fixed.
      </p>
      <p className="text-xs text-muted-foreground mb-6">
        You need to choose both the correct stage and the most appropriate solution.
      </p>

      <div className="space-y-4">
        {SYSTEM_MAP_ISSUES.map((issue, i) => {
          const ans = answers[issue.id];
          const evaluation = evals.find(e => e.issueId === issue.id);
          const showResult = submitted && evaluation;
          const isCorrect = evaluation?.combinationCorrect;

          return (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-panel p-4 border ${
                showResult
                  ? isCorrect
                    ? 'border-[hsl(var(--success))]/40 bg-[hsl(var(--success))]/5'
                    : 'border-danger/40 bg-danger/5'
                  : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-xs text-muted-foreground mt-0.5">#{i + 1}</span>
                  <p className="font-medium text-sm text-foreground">{issue.text}</p>
                </div>
                {showResult && (
                  isCorrect
                    ? <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))] shrink-0" />
                    : <XCircle className="w-5 h-5 text-danger shrink-0" />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="section-label block mb-1.5">Lifecycle stage</label>
                  <Select
                    value={ans?.stage ?? ''}
                    onValueChange={value => setAnswer(issue.id, { stage: value })}
                    disabled={submitted}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select stage..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SYSTEM_MAP_STAGE_OPTIONS.map(stage => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="section-label block mb-1.5">How to fix it</label>
                  <Select
                    value={ans?.fixId ?? ''}
                    onValueChange={value => setAnswer(issue.id, { fixId: value })}
                    disabled={submitted}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select fix..." />
                    </SelectTrigger>
                    <SelectContent>
                      {issue.fixes.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showResult && !isCorrect && (
                <div className="mt-3 pt-3 border-t border-border/60 text-xs text-secondary-foreground space-y-1">
                  {!evaluation?.stageCorrect && (
                    <p>• Best stage(s): <span className="font-medium text-foreground">{issue.correctStages.join(', ')}</span></p>
                  )}
                  {!evaluation?.fixCorrect && (
                    <p>• Stronger fixes: <span className="font-medium text-foreground">{issue.fixes.filter(f => f.correct).map(f => f.label).join(' • ')}</span></p>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 mt-6"
        >
          <p className="section-label mb-2">System Diagnosis Feedback</p>
          <p className="text-sm text-foreground mb-2">
            <span className="font-semibold">{correctCount} / {SYSTEM_MAP_ISSUES.length}</span> issues correctly mapped.
          </p>
          <ul className="text-sm text-secondary-foreground space-y-1">
            {feedbackMessages.map((msg, i) => (
              <li key={i}>• {msg}</li>
            ))}
          </ul>
          {!canProceed && (
            <p className="mt-3 text-xs text-warning bg-warning/10 border border-warning/30 rounded-md px-3 py-2">
              Hint: Think about where the problem originates, not just where it appears. You need at least {REQUIRED_CORRECT} correct matches to continue.
            </p>
          )}
          {canProceed && (
            <p className="mt-3 text-sm text-secondary-foreground italic">
              You've identified where transparency issues occur across the system. Now redesign the explanation shown to the user.
            </p>
          )}
        </motion.div>
      )}

      <div className="flex justify-end items-center gap-3 mt-6">
        {submitted && !canProceed && (
          <button onClick={handleRetry} className="btn-outline-game flex items-center gap-2 text-sm">
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
        )}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allFilled}
            className={`btn-mission flex items-center gap-2 ${!allFilled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Submit System Map
          </button>
        )}
        {submitted && canProceed && (
          <button onClick={onNext} className="btn-mission flex items-center gap-2">
            Build the Explanation
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
      {!allFilled && !submitted && (
        <p className="text-xs text-muted-foreground text-right mt-2">Select a stage and a fix for every issue to submit.</p>
      )}
    </motion.div>
  );
};

export default SystemMapScreen;
