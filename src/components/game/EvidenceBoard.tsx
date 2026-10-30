import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, User, Cpu, BarChart3, FileText, BookOpen, X, ArrowRight, Check } from 'lucide-react';
import { sfx } from '@/hooks/useSoundEffects';
import { GameState } from './GameState';
import StepLayout from './StepLayout';

interface EvidenceBoardProps {
  state: GameState;
  onUpdate: (updates: Partial<GameState>) => void;
  onNext: () => void;
}

const EVIDENCE_CARDS = [
  {
    id: 'complaint',
    icon: MessageSquare,
    label: 'User Complaint',
    stage: 'Deployment Stage',
    color: 'text-danger',
    content: `"I applied for a loan and was rejected almost instantly. The message just said I was 'high risk,' but I don't know what that means. My income is steady and I've never missed a payment before. I need to understand why I was denied and if there's anything I can do about it."`,
  },
  {
    id: 'message',
    icon: Mail,
    label: 'Message Sent to User',
    stage: 'Deployment Stage',
    color: 'text-warning',
    content: `"Your loan application has been denied due to a high-risk rating. At this time, we are unable to approve your request."`,
  },
  {
    id: 'applicant',
    icon: User,
    label: 'Applicant Information',
    stage: 'Data Stage',
    color: 'text-info',
    content: null,
    table: [
      ['Annual income', '$52,000'],
      ['Credit score', '680'],
      ['Existing debt', '$18,000'],
      ['Debt-to-income ratio', '42%'],
      ['Employment type', 'Contract work (2 years)'],
      ['Recent credit checks', '4 in the last 3 months'],
    ],
  },
  {
    id: 'decision',
    icon: Cpu,
    label: 'System Decision',
    stage: 'Model Stage',
    color: 'text-primary',
    content: null,
    table: [
      ['Risk score', '0.76'],
      ['Approval cutoff', '0.70'],
      ['Final decision', 'Denied'],
    ],
    note: 'A higher score means higher risk.',
  },
  {
    id: 'factors',
    icon: BarChart3,
    label: 'What Influenced the Decision',
    stage: 'Model Stage',
    color: 'text-accent',
    content: null,
    lists: {
      high: ['High level of existing debt compared to income', 'Several recent credit checks', 'Type of employment (less stable than full-time)'],
      low: ['Credit score'],
    },
  },
  {
    id: 'internal',
    icon: FileText,
    label: 'Internal Note',
    stage: 'Monitoring Stage',
    color: 'text-muted-foreground',
    content: `"If the risk score is above the cutoff, the system can deny the application automatically without a manual review."`,
  },
  {
    id: 'policy',
    icon: BookOpen,
    label: 'Explanation Policy',
    stage: 'Monitoring Stage',
    color: 'text-evidence',
    content: `"Users should receive a general reason for denial. Detailed system information is not always shared, to prevent misuse or manipulation of the system."`,
  },
];

const EvidenceBoard = ({ state, onUpdate, onNext }: EvidenceBoardProps) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [viewedCards, setViewedCards] = useState<Set<string>>(() => new Set(state.evidenceReviewedIds));

  useEffect(() => {
    setViewedCards(new Set(state.evidenceReviewedIds));
  }, [state.evidenceReviewedIds]);

  const handleCardClick = (id: string) => {
    setExpandedCard(id);
    setViewedCards(prev => {
      const s = new Set(prev);
      const isNew = !s.has(id);
      s.add(id);
      if (isNew) {
        sfx.select();
        onUpdate({ evidenceReviewedIds: Array.from(s) });
      } else {
        sfx.click();
      }
      return s;
    });
  };

  const allViewed = viewedCards.size === EVIDENCE_CARDS.length;
  const expandedIndex = EVIDENCE_CARDS.findIndex(c => c.id === expandedCard);

  const openNext = () => {
    const next = EVIDENCE_CARDS.find(c => !viewedCards.has(c.id) && c.id !== expandedCard)
      ?? EVIDENCE_CARDS[(expandedIndex + 1) % EVIDENCE_CARDS.length];
    if (allViewed && expandedIndex === EVIDENCE_CARDS.length - 1) {
      setExpandedCard(null);
      return;
    }
    handleCardClick(next.id);
  };

  const summaryFor = (card: typeof EVIDENCE_CARDS[number]) => {
    if (card.content) return card.content.replaceAll('"', '');
    if (card.table) return card.table.slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(' · ');
    if (card.lists) return `Biggest influences: ${card.lists.high.join(', ').toLowerCase()}.`;
    return '';
  };

  return (
    <StepLayout
      stepNumber={1}
      title="Look at the evidence"
      instruction={<>You're on Credix's AI Ethics Team. Emily Carter was denied a loan. Open each card to see what happened.</>}
      width="wide"
      onNext={onNext}
      nextLabel="Next: Diagnose"
      nextDisabled={!allViewed}
      hint={allViewed ? 'All evidence reviewed' : `Open all ${EVIDENCE_CARDS.length} cards to continue`}
    >
      {/* Progress */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${(viewedCards.size / EVIDENCE_CARDS.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-muted-foreground tabular-nums whitespace-nowrap">
          {viewedCards.size} of {EVIDENCE_CARDS.length} opened
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EVIDENCE_CARDS.map((card, i) => {
          const Icon = card.icon;
          const viewed = viewedCards.has(card.id);
          return (
            <motion.button
              type="button"
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleCardClick(card.id)}
              className={`evidence-card text-left flex flex-col gap-3 ${viewed ? 'bg-primary/[0.03] border-primary/30' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted shrink-0 ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-sm">{card.label}</p>
                </div>
                {viewed ? (
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="text-xs font-medium text-primary shrink-0 mt-1">Open</span>
                )}
              </div>
              {viewed ? (
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{summaryFor(card)}</p>
              ) : (
                <p className="text-sm text-muted-foreground/70">Tap to read</p>
              )}
              <span className="mt-auto self-start rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{card.stage}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {expandedCard && (() => {
          const card = EVIDENCE_CARDS[expandedIndex];
          const Icon = card.icon;
          const isLastNeeded = allViewed;
          return (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
              onClick={() => setExpandedCard(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-card border border-border rounded-2xl shadow-xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
                role="dialog"
                aria-label={card.label}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${card.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{card.label}</h3>
                      <span className="text-xs text-muted-foreground">{card.stage}</span>
                    </div>
                  </div>
                  <button onClick={() => setExpandedCard(null)} className="p-1.5 rounded-lg hover:bg-muted" aria-label="Close">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {card.content && (
                  <blockquote className="border-l-4 border-primary/30 pl-4 text-secondary-foreground leading-relaxed">{card.content}</blockquote>
                )}

                {card.table && (
                  <div className="rounded-xl border border-border divide-y divide-border">
                    {card.table.map(([key, val]) => (
                      <div key={key} className="flex justify-between px-4 py-2.5">
                        <span className="text-muted-foreground text-sm">{key}</span>
                        <span className="font-mono text-sm font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
                {card.note && <p className="text-sm text-muted-foreground mt-3">{card.note}</p>}

                {card.lists && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-danger mb-2">Big influence</p>
                      <ul className="space-y-1.5">
                        {card.lists.high.map(item => (
                          <li key={item} className="text-sm text-secondary-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-danger mt-2 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">Small influence</p>
                      <ul className="space-y-1.5">
                        {card.lists.low.map(item => (
                          <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => (isLastNeeded ? setExpandedCard(null) : openNext())}
                    className="btn-mission flex items-center gap-2 text-sm px-5 py-2.5"
                  >
                    {isLastNeeded ? 'Done' : 'Next card'}
                    {!isLastNeeded && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </StepLayout>
  );
};

export default EvidenceBoard;
