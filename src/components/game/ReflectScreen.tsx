import { useState } from 'react';
import { motion } from 'framer-motion';
import { PenLine, CheckCircle2, ArrowLeft, Eye } from 'lucide-react';
import { EXPLANATION_OPTIONS, generatePreview, generateFeedback, GameState } from './GameState';

interface ReflectScreenProps {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
  onGoToStep: (step: number) => void;
}

const REFLECTION_QUESTIONS = [
  'What did you change after seeing the feedback?',
  'How did you decide what information to include or leave out?',
  'How did you balance being clear with not overwhelming the user?',
  'Do you think your explanation fully solves the problem? Why or why not?',
];

const ReflectScreen = ({ state, onUpdate, onGoToStep }: ReflectScreenProps) => {
  const [showRevise, setShowRevise] = useState(false);
  const [localElements, setLocalElements] = useState(state.revisedElements.length > 0 ? state.revisedElements : [...state.selectedElements]);

  const toggleElement = (id: string) => {
    if (localElements.includes(id)) {
      setLocalElements(localElements.filter(e => e !== id));
    } else if (localElements.length < 5) {
      setLocalElements([...localElements, id]);
    }
  };

  const saveRevisions = () => {
    onUpdate({ revisedElements: localElements });
    setShowRevise(false);
  };

  const currentElements = state.revisedElements.length > 0 ? state.revisedElements : state.selectedElements;
  const preview = generatePreview(currentElements);
  const feedback = generateFeedback(currentElements);
  const allReflectionsDone = REFLECTION_QUESTIONS.every(q => (state.reflections[q] || '').trim().length > 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-2">
        <PenLine className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Revise & Reflect</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Based on the feedback, make changes and reflect on your decisions.</p>

      {/* Revise toggle */}
      <div className="mb-6">
        <button onClick={() => setShowRevise(!showRevise)} className="btn-outline-game flex items-center gap-2 text-sm">
          <ArrowLeft className="w-3.5 h-3.5" />
          {showRevise ? 'Hide revision panel' : 'Revise your explanation'}
        </button>
      </div>

      {showRevise && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXPLANATION_OPTIONS.map(opt => {
              const selected = localElements.includes(opt.id);
              const disabled = !selected && localElements.length >= 5;
              return (
                <div
                  key={opt.id}
                  onClick={() => !disabled && toggleElement(opt.id)}
                  className={`checkbox-option flex items-center gap-3 text-sm ${selected ? 'selected' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${selected ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                    {selected && <span className="text-primary-foreground text-xs">✓</span>}
                  </div>
                  <span>{opt.label}</span>
                </div>
              );
            })}
          </div>
          <button onClick={saveRevisions} className="btn-mission text-sm">Save Revisions</button>
        </motion.div>
      )}

      {/* Current Preview */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-primary" />
          <p className="section-label">Current Explanation</p>
        </div>
        <div className="live-preview">
          <p className="font-semibold text-sm text-foreground mb-2">Dear Emily,</p>
          {preview.split('\n\n').map((p, i) => (
            <p key={i} className="text-sm text-secondary-foreground leading-relaxed mb-2">{p}</p>
          ))}
          <p className="text-sm text-muted-foreground mt-3">— Credix Support Team</p>
        </div>
      </div>

      {/* Stakeholder summary */}
      <div className="mb-8">
        <p className="section-label mb-2">Stakeholder Summary</p>
        <div className="flex gap-3">
          {feedback.map(fb => (
            <div key={fb.persona} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${
              fb.sentiment === 'positive' ? 'bg-success/10 text-success' : fb.sentiment === 'warning' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
            }`}>
              <span>{fb.sentiment === 'positive' ? '✓' : fb.sentiment === 'warning' ? '⚠' : '✗'}</span>
              {fb.persona.split(' ')[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Reflection */}
      <div className="space-y-6 mb-8">
        <p className="font-semibold">Reflection Questions</p>
        {REFLECTION_QUESTIONS.map((q, i) => (
          <div key={q}>
            <p className="text-sm font-medium mb-2">{i + 1}. {q}</p>
            <textarea
              value={state.reflections[q] || ''}
              onChange={e => onUpdate({ reflections: { ...state.reflections, [q]: e.target.value } })}
              placeholder="Type your reflection..."
              rows={2}
              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        ))}
      </div>

      {allReflectionsDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 text-center border-primary/30"
        >
          <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-1">Mission Complete</h3>
          <p className="text-sm text-muted-foreground">
            You've investigated the case, diagnosed the problem, designed a transparent explanation, and reflected on your choices. Great work, Ethics Team member!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReflectScreen;
