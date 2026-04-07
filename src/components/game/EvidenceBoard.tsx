import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, User, Cpu, BarChart3, FileText, BookOpen, X, ArrowRight } from 'lucide-react';

interface EvidenceBoardProps {
  onNext: () => void;
}

const EVIDENCE_CARDS = [
  {
    id: 'complaint',
    icon: MessageSquare,
    label: 'User Complaint',
    color: 'text-danger',
    content: `"I applied for a loan and was rejected almost instantly. The message just said I was 'high risk,' but I don't know what that means. My income is steady and I've never missed a payment before. I need to understand why I was denied and if there's anything I can do about it."`,
  },
  {
    id: 'message',
    icon: Mail,
    label: 'Message Sent to User',
    color: 'text-warning',
    content: `"Your loan application has been denied based on an automated risk assessment. At this time, we are unable to approve your request."`,
  },
  {
    id: 'applicant',
    icon: User,
    label: 'Applicant Information',
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
    color: 'text-muted-foreground',
    content: `"If the risk score is above the cutoff, the system can deny the application automatically without a manual review."`,
  },
  {
    id: 'policy',
    icon: BookOpen,
    label: 'Explanation Policy',
    color: 'text-evidence',
    content: `"Users should receive a general reason for denial. Detailed system information is not always shared, to prevent misuse or manipulation of the system."`,
  },
];

const EvidenceBoard = ({ onNext }: EvidenceBoardProps) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());

  const handleCardClick = (id: string) => {
    setExpandedCard(id);
    setViewedCards(prev => new Set(prev).add(id));
  };

  const allViewed = viewedCards.size === EVIDENCE_CARDS.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Evidence Board</h2>
        <p className="text-sm text-muted-foreground">
          Explore the case by reviewing the information below. Click on each item to learn more.
          <span className="text-primary ml-2 font-mono text-xs">{viewedCards.size}/{EVIDENCE_CARDS.length} reviewed</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EVIDENCE_CARDS.map((card, i) => {
          const Icon = card.icon;
          const viewed = viewedCards.has(card.id);
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleCardClick(card.id)}
              className={`evidence-card flex items-start gap-3 ${viewed ? 'border-primary/30' : ''}`}
            >
              <div className={`p-2 rounded-lg bg-muted shrink-0 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-sm">{card.label}</p>
                {viewed && <p className="text-xs text-primary mt-1">✓ Reviewed</p>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {expandedCard && (() => {
          const card = EVIDENCE_CARDS.find(c => c.id === expandedCard)!;
          const Icon = card.icon;
          return (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
              onClick={() => setExpandedCard(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="glass-panel p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${card.color}`} />
                    <h3 className="font-bold">{card.label}</h3>
                  </div>
                  <button onClick={() => setExpandedCard(null)} className="p-1 rounded hover:bg-muted">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {card.content && (
                  <p className="text-secondary-foreground leading-relaxed italic">{card.content}</p>
                )}

                {card.table && (
                  <div className="space-y-2">
                    {card.table.map(([key, val]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="text-muted-foreground text-sm">{key}</span>
                        <span className="font-mono text-sm font-medium">{val}</span>
                      </div>
                    ))}
                    {card.note && <p className="text-xs text-muted-foreground italic mt-2">{card.note}</p>}
                  </div>
                )}

                {card.lists && (
                  <div className="space-y-4">
                    <div>
                      <p className="section-label text-danger mb-2">Higher Weight</p>
                      <ul className="space-y-1.5">
                        {card.lists.high.map(item => (
                          <li key={item} className="text-sm text-secondary-foreground flex items-start gap-2">
                            <span className="text-danger mt-1">▸</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="section-label text-muted-foreground mb-2">Lower Weight</p>
                      <ul className="space-y-1.5">
                        {card.lists.low.map(item => (
                          <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="mt-1">▸</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={!allViewed}
          className={`btn-mission flex items-center gap-2 ${!allViewed ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Proceed to Diagnosis
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {!allViewed && (
        <p className="text-xs text-muted-foreground text-right mt-2">Review all evidence cards to continue</p>
      )}
    </motion.div>
  );
};

export default EvidenceBoard;
