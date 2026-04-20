import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenLine, ArrowLeft, Eye, ChevronDown, ChevronUp, Send, Users } from 'lucide-react';
import { EXPLANATION_OPTIONS, FINAL_LIFECYCLE_REFLECTIONS, generatePreview, generateFeedback, GameState } from './GameState';
import { sfx } from '@/hooks/useSoundEffects';

interface ReflectScreenProps {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
  onGoToStep: (step: number) => void;
  onSubmitAll: () => void;
}

const REFLECTION_QUESTIONS = [
  'What did you change after seeing the feedback?',
  'How did you decide what information to include or leave out?',
  'How did you balance being clear with not overwhelming the user?',
  'Do you think your explanation fully solves the problem? Why or why not?',
];

const ReflectScreen = ({ state, onUpdate, onGoToStep, onSubmitAll }: ReflectScreenProps) => {
  const [showRevise, setShowRevise] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  const reflections = state.reflections ?? {};
  const lifecycleNotes = state.lifecycleNotes ?? {};
  const [localElements, setLocalElements] = useState(
    state.revisedElements.length > 0 ? state.revisedElements : [...state.selectedElements]
  );

  const toggleElement = (id: string) => {
    if (localElements.includes(id)) {
      setLocalElements(localElements.filter(e => e !== id));
      sfx.deselect();
    } else if (localElements.length < 5) {
      setLocalElements([...localElements, id]);
      sfx.select();
    }
  };

  const saveRevisions = () => {
    onUpdate({ revisedElements: localElements });
    setShowRevise(false);
    sfx.success();
  };

  const handleSubmitFinal = () => {
    onUpdate({ revisedElements: localElements.length > 0 ? localElements : state.selectedElements });
    setSubmitted(true);
    sfx.submit();
  };

  const handleBack = () => {
    sfx.navigate();
    onGoToStep(state.step - 1);
  };

  const currentElements = state.revisedElements.length > 0 ? state.revisedElements : state.selectedElements;
  const preview = generatePreview(localElements.length > 0 ? localElements : currentElements);
  const feedback = generateFeedback(localElements.length > 0 ? localElements : currentElements);
  const allReflectionsDone = REFLECTION_QUESTIONS.every(q => (reflections[q] || '').trim().length > 5);
  const allLifecycleDone = FINAL_LIFECYCLE_REFLECTIONS.every(q => (lifecycleNotes[q] || '').trim().length > 5);

  const toggleFeedbackExpand = (persona: string) => {
    setExpandedFeedback(prev => (prev === persona ? null : persona));
    sfx.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-4">
      <button
        onClick={handleBack}
        className="btn-outline-game flex items-center gap-2 text-sm mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Feedback
      </button>

      <div className="flex items-center gap-2 mb-2">
        <PenLine className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Revise & Reflect</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Review stakeholder feedback, revise your explanation if needed, then submit your final version.
      </p>

      {/* Full Stakeholder Feedback */}
      {!submitted && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <p className="section-label">Stakeholder Feedback</p>
          </div>
          <div className="space-y-3">
            {feedback.map((fb, i) => (
              <motion.div
                key={fb.persona}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`feedback-card ${
                  fb.sentiment === 'positive' ? 'feedback-positive' : fb.sentiment === 'warning' ? 'feedback-warning' : 'feedback-negative'
                }`}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleFeedbackExpand(fb.persona)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      fb.sentiment === 'positive' ? 'bg-[hsl(var(--success)/0.2)] text-[hsl(var(--success))]'
                        : fb.sentiment === 'warning' ? 'bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning))]'
                        : 'bg-[hsl(var(--danger)/0.2)] text-[hsl(var(--danger))]'
                    }`}>
                      {fb.persona.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{fb.persona}</p>
                      <p className="text-xs text-muted-foreground">{fb.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      fb.sentiment === 'positive' ? 'bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]'
                        : fb.sentiment === 'warning' ? 'bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))]'
                        : 'bg-[hsl(var(--danger)/0.1)] text-[hsl(var(--danger))]'
                    }`}>
                      {fb.sentiment === 'positive' ? '✓ Positive' : fb.sentiment === 'warning' ? '⚠ Needs Work' : '✗ Negative'}
                    </span>
                    {expandedFeedback === fb.persona ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedFeedback === fb.persona && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-secondary-foreground italic mt-3 pt-3 border-t border-border">
                        "{fb.message}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Revise toggle */}
      {!submitted && (
        <div className="mb-6">
          <button
            onClick={() => { setShowRevise(!showRevise); sfx.click(); }}
            className="btn-outline-game flex items-center gap-2 text-sm"
          >
            <PenLine className="w-3.5 h-3.5" />
            {showRevise ? 'Hide revision panel' : 'Revise your explanation'}
          </button>
        </div>
      )}

      {showRevise && !submitted && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-8 space-y-4">
          <p className="text-xs text-muted-foreground">Select up to 5 elements for your revised explanation.</p>
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
          <p className="section-label">
            {submitted ? 'Your Final Explanation' : 'Current Explanation Preview'}
          </p>
        </div>
        <div className="live-preview">
          <p className="font-semibold text-sm text-foreground mb-2">Dear Emily,</p>
          {preview.split('\n\n').map((p, i) => (
            <p key={i} className="text-sm text-secondary-foreground leading-relaxed mb-2">{p}</p>
          ))}
          <p className="text-sm text-muted-foreground mt-3">— Credix Support Team</p>
        </div>
      </div>

      {/* Submit Final button */}
      {!submitted && (
        <div className="flex justify-center mb-10">
          <button onClick={handleSubmitFinal} className="btn-mission flex items-center gap-2 text-base px-10 py-4">
            <Send className="w-4 h-4" />
            Submit Final Explanation
          </button>
        </div>
      )}

      {/* Reflection Questions - only after submission */}
      {submitted && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4 text-accent" />
              <p className="font-semibold">Reflection Questions</p>
            </div>
            <p className="text-sm text-muted-foreground -mt-3">
               Now that you've finalized your explanation, reflect on your design decisions. Each response needs at least 6 characters.
            </p>
            {REFLECTION_QUESTIONS.map((q, i) => (
              <div key={q}>
                <p className="text-sm font-medium mb-2">{i + 1}. {q}</p>
                <textarea
                  value={reflections[q] || ''}
                  onChange={e => onUpdate({ reflections: { ...reflections, [q]: e.target.value } })}
                  placeholder="Type your reflection..."
                  rows={2}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            ))}
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4 text-primary" />
              <p className="font-semibold">AI Lifecycle Governance</p>
            </div>
            <p className="text-sm text-muted-foreground -mt-3">
              Connect this case to where transparency and explainability matter across the AI lifecycle.
            </p>
            {FINAL_LIFECYCLE_REFLECTIONS.map((q, i) => (
              <div key={q}>
                <p className="text-sm font-medium mb-2">{i + 1}. {q}</p>
                <textarea
                  value={lifecycleNotes[q] || ''}
                  onChange={e => onUpdate({ lifecycleNotes: { ...lifecycleNotes, [q]: e.target.value } })}
                  placeholder="Type your response..."
                  rows={2}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-10">
            <button
              onClick={() => { sfx.submit(); onSubmitAll(); }}
              disabled={!allReflectionsDone || !allLifecycleDone}
              className={`btn-mission flex items-center gap-2 text-base px-10 py-4 ${!allReflectionsDone || !allLifecycleDone ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Send className="w-4 h-4" />
              Submit Responses
            </button>
          </div>
          {(!allReflectionsDone || !allLifecycleDone) && (
            <p className="text-xs text-muted-foreground text-center -mt-6 mb-8">Complete all reflection and lifecycle questions to submit</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReflectScreen;
