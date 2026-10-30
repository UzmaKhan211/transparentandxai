import { motion } from 'framer-motion';
import { Layers3, ThumbsUp, AlertCircle, XCircle } from 'lucide-react';
import { generateFeedback, generateLifecycleInsight, GameState } from './GameState';
import StepLayout from './StepLayout';

interface FeedbackScreenProps {
  state: GameState;
  onNext: () => void;
  onGoToStep: (step: number) => void;
}

const SENTIMENT = {
  positive: { label: 'Happy', Icon: ThumbsUp, card: 'feedback-positive', badge: 'bg-success/10 text-success', avatar: 'bg-success/15 text-success' },
  warning: { label: 'Has concerns', Icon: AlertCircle, card: 'feedback-warning', badge: 'bg-warning/10 text-warning', avatar: 'bg-warning/15 text-warning' },
  negative: { label: 'Not happy', Icon: XCircle, card: 'feedback-negative', badge: 'bg-danger/10 text-danger', avatar: 'bg-danger/15 text-danger' },
} as const;

const FeedbackScreen = ({ state, onNext, onGoToStep }: FeedbackScreenProps) => {
  const feedback = generateFeedback(state.selectedElements);
  const lifecycleInsight = generateLifecycleInsight(state.selectedElements);
  const happyCount = feedback.filter(f => f.sentiment === 'positive').length;

  return (
    <StepLayout
      stepNumber={5}
      title="Test it with real people"
      instruction="Three people read your new message. See what they think. Not happy with it? Go back and change your choices."
      onBack={() => onGoToStep(5)}
      backLabel="Back to Build to revise"
      onNext={onNext}
      nextLabel="Finish case study"
      hint={`${happyCount} of ${feedback.length} happy`}
    >
      <div className="space-y-4">
        {feedback.map((fb, i) => {
          const s = SENTIMENT[fb.sentiment];
          return (
            <motion.div
              key={fb.persona}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`feedback-card rounded-2xl ${s.card}`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${s.avatar}`}>
                    {fb.persona.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{fb.persona}</p>
                    <p className="text-sm text-muted-foreground">{fb.role}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.badge}`}>
                  <s.Icon className="w-3.5 h-3.5" />
                  {s.label}
                </span>
              </div>
              <p className="text-secondary-foreground leading-relaxed">"{fb.message}"</p>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-5 mt-6 flex gap-3">
        <Layers3 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Across the AI system</p>
          <p className="text-sm text-secondary-foreground">{lifecycleInsight}</p>
        </div>
      </div>
    </StepLayout>
  );
};

export default FeedbackScreen;
