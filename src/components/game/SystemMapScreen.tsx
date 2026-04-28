import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Map, Database, Cpu, Monitor, Activity } from 'lucide-react';
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
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    onUpdate({
      systemMapTimeSpent: (state.systemMapTimeSpent ?? 0) + elapsed,
      systemMapSubmitted: true,
    });
    setSubmitted(true);
  };

  const insights = submitted ? buildSystemThinkingInsight(responses) : [];

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
        This system has multiple transparency issues. For each issue below, identify where it should be addressed in the AI lifecycle and explain how it could be improved.
      </p>
      <p className="text-xs text-muted-foreground mb-6">
        There may be more than one valid approach. Focus on your reasoning.
      </p>

      {/* Lifecycle Reference */}
      <div className="glass-panel p-4 mb-6">
        <p className="section-label mb-3">AI Lifecycle Stages — Reference</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LIFECYCLE_STAGE_DESCRIPTIONS.map(({ stage, short }) => {
            const Icon = STAGE_ICONS[stage];
            return (
              <div key={stage} className="flex flex-col items-start gap-1.5 rounded-md border border-border/60 bg-background/40 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{stage}</span>
                </div>
                <span className="text-xs text-muted-foreground leading-snug">{short}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {SYSTEM_MAP_ISSUES.map((issue, i) => {
          const r = responses[issue.id];
          return (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-4 border border-border"
            >
              <div className="flex items-start gap-2 mb-3">
                <span className="font-mono text-xs text-muted-foreground mt-0.5">#{i + 1}</span>
                <p className="font-medium text-sm text-foreground">{issue.text}</p>
              </div>

              <div className="mb-3">
                <label className="section-label block mb-2">Which stage should address this?</label>
                <div className="flex flex-wrap gap-2">
                  {SYSTEM_MAP_STAGE_OPTIONS.map(stage => {
                    const selected = r?.stage === stage;
                    const Icon = STAGE_ICONS[stage];
                    return (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => { setResponse(issue.id, { stage }); sfx.select(); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                          selected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-background/40 text-secondary-foreground hover:border-primary/40'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {stage}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="section-label block mb-1.5">How would you fix this issue at this stage?</label>
                <Textarea
                  value={r?.explanation ?? ''}
                  onChange={e => setResponse(issue.id, { explanation: e.target.value })}
                  placeholder="Briefly describe your approach..."
                  className="min-h-[70px] text-sm"
                  maxLength={400}
                />
                <p className="text-[10px] text-muted-foreground text-right mt-1">{(r?.explanation ?? '').length}/400</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 mt-6 space-y-4"
        >
          <div>
            <p className="section-label mb-2">Suggested Answers & Rationale</p>
            <p className="text-xs text-muted-foreground mb-3">
              There can be more than one valid stage, but here is the stage most directly responsible for each issue.
            </p>
            <div className="space-y-3">
              {SYSTEM_MAP_ISSUES.map((issue, i) => {
                const r = responses[issue.id];
                const match = r?.stage === issue.suggestedStage;
                return (
                  <div
                    key={issue.id}
                    className={`rounded-md border p-3 ${
                      match ? 'border-[hsl(var(--success))]/40 bg-[hsl(var(--success))]/5' : 'border-amber-500/40 bg-amber-500/5'
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground mb-1.5">
                      <span className="font-mono text-xs text-muted-foreground mr-1">#{i + 1}</span>
                      {issue.text}
                    </p>
                    <p className="text-xs text-secondary-foreground">
                      <span className="font-semibold">Your selection:</span> {r?.stage || '(none)'}{' '}
                      <span className={match ? 'text-[hsl(var(--success))]' : 'text-amber-600'}>
                        {match ? '✓ matches suggested stage' : '⚠ differs from suggested stage'}
                      </span>
                    </p>
                    <p className="text-xs text-secondary-foreground mt-1">
                      <span className="font-semibold">Suggested stage:</span> {issue.suggestedStage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{issue.rationale}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="section-label mb-2">System Thinking Insight</p>
            <ul className="text-sm text-secondary-foreground space-y-1">
              {insights.map((msg, i) => (
                <li key={i}>• {msg}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-secondary-foreground italic">
              You've explored where transparency issues exist across the system. Next, redesign the explanation shown to the user.
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-end items-center gap-3 mt-6">
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`btn-mission flex items-center gap-2 ${!allAnswered ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Submit Responses
          </button>
        )}
        {submitted && (
          <button onClick={onNext} className="btn-mission flex items-center gap-2">
            Build the Explanation
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
      {!allAnswered && !submitted && (
        <p className="text-xs text-muted-foreground text-right mt-2">Select a stage and write a short explanation for every issue.</p>
      )}
    </motion.div>
  );
};

export default SystemMapScreen;
