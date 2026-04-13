import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, CheckCircle2, XCircle, ChevronRight, Info, MousePointerClick, MessageSquare, Lightbulb, Send } from 'lucide-react';
import { sfx } from '@/hooks/useSoundEffects';

interface OnboardingScreenProps {
  onNext: () => void;
}

interface ConceptQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CONCEPT_QUESTIONS: ConceptQuestion[] = [
  {
    id: 'trans-vs-explain',
    question: 'What is the key difference between AI transparency and AI explainability?',
    options: [
      'Transparency focuses on individual outputs; explainability focuses on the overall system',
      'Transparency makes the overall system visible; explainability makes a specific output interpretable',
      'They are the same concept with different names',
      'Transparency is a technical method; explainability is a legal requirement',
    ],
    correctIndex: 1,
    explanation: 'Transparency is broader and system-level — it concerns the visibility of how an AI system works overall (data, processes, limitations). Explainability is narrower and output-level — it focuses on making a specific decision or prediction understandable.',
  },
  {
    id: 'shap-vs-lime',
    question: 'How do SHAP and LIME differ in their approach to explaining AI predictions?',
    options: [
      'SHAP opens the black box fully; LIME only provides partial access',
      'LIME builds a simpler local surrogate model around one prediction; SHAP assigns contribution values to each feature based on their effect',
      'SHAP is used for simple models; LIME is used for complex models',
      'LIME provides global explanations; SHAP provides local explanations',
    ],
    correctIndex: 1,
    explanation: 'LIME explains a prediction by building a simpler local surrogate model around one case. SHAP explains by assigning contribution values to each feature based on Shapley values from game theory. Neither fully opens the black box — both are post hoc tools.',
  },
  {
    id: 'opacity-levels',
    question: 'What does it mean that "opacity can exist at multiple levels" in AI systems?',
    options: [
      'It means AI systems can have different levels of security encryption',
      'It means lack of understanding can exist at different levels: purpose, data pipeline, specific output reasoning, or human oversight',
      'It means some AI systems are more opaque than others based on their algorithm',
      'It means transparency is either present or absent — there is no in-between',
    ],
    correctIndex: 1,
    explanation: 'Opacity is not a simple yes-or-no feature. Sometimes the overall purpose of the system is unclear, sometimes the data pipeline is unclear, sometimes the reasoning behind a specific output is unclear, or the role of human oversight is unclear.',
  },
  {
    id: 'transparency-by-design',
    question: 'Why does "transparency by design" matter?',
    options: [
      'Because regulations require it to be documented after deployment',
      'Because transparency added after a system is built is always sufficient',
      'Because considering transparency from the start of development makes systems more likely to be understandable in practice',
      'Because it is cheaper to add transparency features later in development',
    ],
    correctIndex: 2,
    explanation: 'When built into the design process from the earliest stages, developers think carefully about what information should be visible, what explanations different audiences need, and how the system\'s operations can be communicated.',
  },
  {
    id: 'disclosure-vs-transparency',
    question: 'A company releases a 200-page technical document about its AI system. Is this transparency?',
    options: [
      'Yes — releasing information is the same as being transparent',
      'Not necessarily — transparency requires information to be meaningful, accessible, and understandable to those who need it',
      'Yes — more documentation always means more transparency',
      'No — transparency only means showing the source code',
    ],
    correctIndex: 1,
    explanation: 'Transparency is not the same as disclosure. A system is not automatically transparent simply because information is available. It depends on whether that information is meaningful, accessible, and understandable to the people who need it.',
  },
];

const OnboardingScreen = ({ onNext }: OnboardingScreenProps) => {
  const [phase, setPhase] = useState<'welcome' | 'quiz'>('welcome');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleStartQuiz = () => {
    sfx.navigate();
    setPhase('quiz');
  };

  const handleSelectAnswer = (index: number) => {
    if (showResult) return;
    sfx.select();
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || showResult) return;
    setShowResult(true);
    const isCorrect = selectedAnswer === CONCEPT_QUESTIONS[currentQ].correctIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      sfx.success();
    } else {
      sfx.click();
    }
  };

  const handleNextQuestion = () => {
    sfx.navigate();
    if (currentQ < CONCEPT_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const q = CONCEPT_QUESTIONS[currentQ];
  const passed = correctCount >= 3;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            {/* Title */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider mb-6">
                <BookOpen className="w-3.5 h-3.5" />
                Classroom Activity
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold leading-tight mb-3">
                Hands-on Exploration of<br />
                <span className="text-primary">Explainability & Transparency</span> in AI
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
                A simulation-based activity where you'll investigate an AI decision, diagnose what went wrong, and design a more transparent explanation.
              </p>
            </motion.div>

            {/* How it works */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-6 w-full mb-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-primary" />
                <p className="font-semibold text-sm">How This Activity Works</p>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MousePointerClick className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-foreground">Buttons enable on task completion.</strong> Complete each task before the "Next" button becomes active.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-foreground">Open-ended responses need at least 10 characters</strong> to enable the next step.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-foreground">You can always go back.</strong> Use the back button on any screen to revisit and revise.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Activity steps overview */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="glass-panel p-6 w-full mb-8"
            >
              <p className="section-label mb-3">Activity Steps</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                {[
                  { step: 1, label: 'Read the mission brief', emoji: '📋' },
                  { step: 2, label: 'Investigate the evidence', emoji: '🔍' },
                  { step: 3, label: 'Diagnose the problem', emoji: '🩺' },
                  { step: 4, label: 'Build a better explanation', emoji: '🛠️' },
                  { step: 5, label: 'Test with stakeholders', emoji: '👥' },
                  { step: 6, label: 'Revise, reflect & submit', emoji: '✍️' },
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-3 text-secondary-foreground p-3 rounded-lg bg-muted/60">
                    <span className="text-lg">{s.emoji}</span>
                    <div>
                      <span className="text-xs text-muted-foreground font-mono">Step {s.step}</span>
                      <p className="text-sm font-medium text-foreground">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleStartQuiz}
              className="btn-mission flex items-center gap-2 text-base"
            >
              Start Concept Check
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <p className="text-xs text-muted-foreground mt-2">Quick quiz on key concepts before you begin</p>
          </motion.div>
        )}

        {phase === 'quiz' && !quizComplete && (
          <motion.div
            key={`quiz-${currentQ}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="section-label">Concept Check</p>
              <p className="text-xs text-muted-foreground font-mono">{currentQ + 1} / {CONCEPT_QUESTIONS.length}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQ + (showResult ? 1 : 0)) / CONCEPT_QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <h3 className="text-lg font-semibold mb-5 leading-relaxed">{q.question}</h3>

            <div className="space-y-3 mb-6">
              {q.options.map((opt, i) => {
                let borderClass = 'border-border';
                let bgClass = '';
                let ringClass = '';
                if (showResult) {
                  if (i === q.correctIndex) {
                    borderClass = 'border-[hsl(var(--success))]';
                    bgClass = 'bg-[hsl(var(--success)/0.08)]';
                  } else if (i === selectedAnswer && i !== q.correctIndex) {
                    borderClass = 'border-[hsl(var(--danger))]';
                    bgClass = 'bg-[hsl(var(--danger)/0.05)]';
                  }
                } else if (i === selectedAnswer) {
                  borderClass = 'border-primary';
                  bgClass = 'bg-primary/5';
                  ringClass = 'ring-2 ring-primary/20';
                }
                return (
                  <motion.div
                    key={i}
                    whileHover={!showResult ? { scale: 1.01 } : {}}
                    whileTap={!showResult ? { scale: 0.99 } : {}}
                    onClick={() => handleSelectAnswer(i)}
                    className={`glass-panel p-4 cursor-pointer transition-all duration-200 border ${borderClass} ${bgClass} ${ringClass} ${!showResult ? 'hover:border-primary/40 hover:shadow-sm' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {showResult && i === q.correctIndex && <CheckCircle2 className="w-5 h-5 text-[hsl(var(--success))]" />}
                        {showResult && i === selectedAnswer && i !== q.correctIndex && <XCircle className="w-5 h-5 text-[hsl(var(--danger))]" />}
                        {(!showResult || (i !== q.correctIndex && i !== selectedAnswer)) && (
                          <div className={`w-5 h-5 rounded-full border-2 transition-colors ${i === selectedAnswer && !showResult ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`}>
                            {i === selectedAnswer && !showResult && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="text-sm leading-relaxed">{opt}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Submit answer button - only show when an answer is selected but not yet submitted */}
            {selectedAnswer !== null && !showResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end mb-6">
                <button onClick={handleSubmitAnswer} className="btn-mission flex items-center gap-2 text-sm">
                  <Send className="w-4 h-4" />
                  Submit Answer
                </button>
              </motion.div>
            )}

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-panel p-4 mb-6 border-l-4 ${selectedAnswer === q.correctIndex ? 'border-l-[hsl(var(--success))]' : 'border-l-[hsl(var(--danger))]'}`}
              >
                <p className="text-sm leading-relaxed">
                  <strong className={`${selectedAnswer === q.correctIndex ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
                    {selectedAnswer === q.correctIndex ? '✓ Correct!' : '✗ Not quite.'}
                  </strong>{' '}
                  <span className="text-muted-foreground">{q.explanation}</span>
                </p>
              </motion.div>
            )}

            {showResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                <button onClick={handleNextQuestion} className="btn-mission flex items-center gap-2 text-sm">
                  {currentQ < CONCEPT_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'quiz' && quizComplete && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={`inline-flex w-24 h-24 rounded-2xl items-center justify-center text-3xl font-bold mb-5 ${
                passed ? 'bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))]' : 'bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))]'
              }`}
            >
              {correctCount}/{CONCEPT_QUESTIONS.length}
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">
              {passed ? '🎉 Great job!' : '💪 Good effort!'}
            </h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              {passed
                ? 'You have a solid understanding of the key concepts. You\'re ready to apply them in the simulation.'
                : 'Some concepts could use another look — but don\'t worry! The simulation ahead will help reinforce these ideas as you apply them.'}
            </p>
            <button
              onClick={() => { sfx.navigate(); onNext(); }}
              className="btn-mission flex items-center gap-2 mx-auto text-base"
            >
              Begin the Activity
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OnboardingScreen;
