import { motion } from 'framer-motion';
import { CheckCircle2, Shield } from 'lucide-react';
import { GameState } from './GameState';
import { sfx } from '@/hooks/useSoundEffects';
import ResponseExport from './ResponseExport';
import { useEffect } from 'react';

interface MissionCompleteScreenProps {
  state: GameState;
}

const MissionCompleteScreen = ({ state }: MissionCompleteScreenProps) => {
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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
        >
          <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
        </motion.div>

        <h2 className="text-2xl font-bold mb-2">Mission Complete</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          You've investigated the case, diagnosed the problem, designed a transparent explanation, and reflected on your choices. Great work, Ethics Team member!
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-8">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span>Credix AI Ethics Response Team — Case Closed</span>
        </div>

        <div className="flex justify-center">
          <ResponseExport state={state} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MissionCompleteScreen;
