import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Users, Layers3 } from 'lucide-react';
import { generateFeedback, generateLifecycleInsight, getLifecycleCoverage, GameState } from './GameState';
import { sfx } from '@/hooks/useSoundEffects';

interface FeedbackScreenProps {
  state: GameState;
  onNext: () => void;
  onGoToStep: (step: number) => void;
}

const FeedbackScreen = ({ state, onNext, onGoToStep }: FeedbackScreenProps) => {
  const feedback = generateFeedback(state.selectedElements);
  const lifecycleInsight = generateLifecycleInsight(state.selectedElements);
  const lifecycleCoverage = getLifecycleCoverage(state.selectedElements);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-4">
      <button
        onClick={() => { sfx.navigate(); onGoToStep(4); }}
        className="btn-outline-game flex items-center gap-2 text-sm mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Build
      </button>
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Test Your Design</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">See how different stakeholders respond to your explanation.</p>

      <div className="space-y-4">
        {feedback.map((fb, i) => (
          <motion.div
            key={fb.persona}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
            className={`feedback-card ${
              fb.sentiment === 'positive' ? 'feedback-positive' : fb.sentiment === 'warning' ? 'feedback-warning' : 'feedback-negative'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                fb.sentiment === 'positive' ? 'bg-success/20 text-success' : fb.sentiment === 'warning' ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'
              }`}>
                {fb.persona.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-sm">{fb.persona}</p>
                <p className="text-xs text-muted-foreground">{fb.role}</p>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground italic">"{fb.message}"</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel mt-6 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Layers3 className="w-4 h-4 text-primary" />
          <p className="section-label">Lifecycle Insight</p>
        </div>
        <p className="text-sm text-secondary-foreground">{lifecycleInsight}</p>
        {lifecycleCoverage.addressed.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">Addressed: {lifecycleCoverage.addressed.join(', ')}</p>
        )}
      </div>

      <div className="flex justify-end mt-8">
        <button onClick={() => { sfx.navigate(); onNext(); }} className="btn-mission flex items-center gap-2">
          Revise & Reflect
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default FeedbackScreen;
