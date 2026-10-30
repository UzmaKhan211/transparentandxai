import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ClipboardList } from 'lucide-react';
import { sfx } from '@/hooks/useSoundEffects';
import { useEffect } from 'react';

interface MissionCompleteScreenProps {
  onGoToStep: (step: number) => void;
}

const MissionCompleteScreen = ({ onGoToStep }: MissionCompleteScreenProps) => {
  useEffect(() => {
    sfx.complete();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="glass-panel p-8 text-center border-primary/30"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}>
          <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-2">Case Study Complete 🎉</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          You've investigated the case, mapped the issues across the AI lifecycle, built a better explanation and tested it with stakeholders.
        </p>

        <div className="rounded-lg border border-border bg-muted/40 p-4 flex items-start gap-3 text-left max-w-md mx-auto mb-6">
          <ClipboardList className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-secondary-foreground">
            <strong className="text-foreground">Next:</strong> answer the submission questions your instructor has shared. Keep this screen open if you want to look back at your work.
          </p>
        </div>

        <button
          onClick={() => { sfx.navigate(); onGoToStep(6); }}
          className="btn-outline-game inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Stakeholder Feedback
        </button>
      </motion.div>
    </motion.div>
  );
};

export default MissionCompleteScreen;
