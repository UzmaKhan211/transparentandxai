import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Monitor, Activity, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';
import StepLayout from './StepLayout';
import { GameState } from './GameState';
import {
  SYSTEM_MAP_ISSUES,
  SYSTEM_MAP_STAGE_OPTIONS,
  LIFECYCLE_STAGE_DESCRIPTIONS,
  buildSystemThinkingInsight,
} from './SystemMapData';
import { Textarea } from '@/components/ui/textarea';
import { sfx } from '@/hooks/useSoundEffects';

interface SystemMapScreenProps {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
  onNext: () => void;
  onGoToStep: (step: number) => void;
}

const STAGE_ICONS: Record<string, typeof Database> = {
  'Data Stage': Database,
  'Model Stage': Cpu,
  'Deployment Stage': Monitor,
  'Monitoring Stage': Activity,
};

const SystemMapScreen = ({ state, onUpdate, onNext, onGoToStep }: SystemMapScreenProps) => {
  const responses = state.systemMapResponses ?? {};
  const [submitted, setSubmitted] = useState(state.systemMapSubmitted ?? false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const setResponse = (issueId: string, patch: Partial<{ stage: string; explanation: string }>) => {
    const prev = responses[issueId] ?? { stage: '', explanation: '' };
    const updated = { ...responses, [issueId]: { ...prev, ...patch } };
    onUpdate({ systemMapResponses: updated });
  };

  const allAnswered = useMemo(
    () => SYSTEM_MAP_ISSUES.every(i => {
      const r = responses[i.id];
      return r?.stage && r?.explanation && r.explanation.trim().length > 0;
    }),
    [responses]
  );

  const handleSubmit = () => {
    sfx.submit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    onUpdate({
      systemMapTimeSpent: (state.systemMapTimeSpent ?? 0) + elapsed,
      systemMapSubmitted: true,
    });
    setSubmitted(true);
  };

  const insights = submitted ? buildSystemThinkingInsight(responses) : [];

  const answeredCount = SYSTEM_MAP_ISSUES.filter(i => {
    const r = responses[i.id];
    return r?.stage && r?.explanation?.trim();
  }).length;

  return (
    <StepLayout
      stepNumber={3}
      title="Fix the System Map"
      instruction="For each problem, pick the stage of the AI system where it should be fixed, then say how you'd fix it. There's no single right answer."
      onBack={() => onGoToStep(3)}
      backLabel="Back to diagnose"
      onNext={submitted ? onNext : handleSubmit}
      nextLabel={submitted ? 'Next: Build' : 'Check my answers'}
      nextDisabled={!submitted && !allAnswered}
      hint={submitted ? 'Read the suggestions, then continue' : `${answeredCount} of ${SYSTEM_MAP_ISSUES.length} answered`}
    >
      {/* Lifecycle reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {LIFECYCLE_STAGE_DESCRIPTIONS.map(({ stage, short }, idx) => {
          const Icon = STAGE_ICONS[stage];
          return (
            <div key={stage} className="rounded-xl bg-primary/5 px-3 py-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{idx + 1}. {stage.replace(' Stage', '')}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">{short}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-5">
        {SYSTEM_MAP_ISSUES.map((issue, i) => {
          const r = responses[issue.id];
          const match = r?.stage === issue.suggestedStage;
          return (
            <section key={issue.id} className="question-card">
              <div className="flex gap-3 mb-4">
                <span className="question-number">{i + 1}</span>
                <p className="font-semibold pt-0.5">{issue.text}</p>
              </div>

              <p className="text-sm text-muted-foreground mb-2">Where should this be fixed?</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {SYSTEM_MAP_STAGE_OPTIONS.map(stage => {
                  const selected = r?.stage === stage;
                  const Icon = STAGE_ICONS[stage];
                  return (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => { setResponse(issue.id, { stage }); sfx.select(); }}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                        selected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-secondary-foreground hover:border-primary/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {stage.replace(' Stage', '')}
                    </button>
                  );
                })}
              </div>

              <p className="text-sm text-muted-foreground mb-2">How would you fix it?</p>
              <Textarea
                value={r?.explanation ?? ''}
                onChange={e => setResponse(issue.id, { explanation: e.target.value })}
                placeholder="Write your idea here..."
                className="min-h-[72px] text-sm rounded-xl"
                maxLength={400}
              />

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 rounded-xl p-3.5 text-sm ${match ? 'bg-success/10' : 'bg-warning/10'}`}
                >
                  <p className={`font-semibold mb-1 flex items-center gap-1.5 ${match ? 'text-success' : 'text-warning'}`}>
                    {match ? <CheckCircle2 className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                    {match ? 'Same as our suggestion' : `Suggested: ${issue.suggestedStage}`}
                  </p>
                  <p className="text-secondary-foreground leading-relaxed">{issue.rationale}</p>
                </motion.div>
              )}
            </section>
          );
        })}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-primary/5 border border-primary/20 p-5 mt-6"
        >
          <p className="font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            System Thinking Insight
          </p>
          <ul className="text-sm text-secondary-foreground space-y-1.5">
            {insights.map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
          <p className="mt-3 text-sm text-foreground">
            Next, you'll redesign the explanation Emily sees.
          </p>
        </motion.div>
      )}
    </StepLayout>
  );
};

export default SystemMapScreen;
