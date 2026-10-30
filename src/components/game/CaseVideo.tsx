import { motion } from 'framer-motion';
import { ArrowRight, Film, Shield } from 'lucide-react';
import { sfx } from '@/hooks/useSoundEffects';
import caseVideo from '@/assets/videos/case-intro.mp4.asset.json';

interface CaseVideoProps {
  onNext: () => void;
}

const CaseVideo = ({ onNext }: CaseVideoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Film className="w-5 h-5 text-primary" />
        <p className="section-label">Section 2 · The Case</p>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">Emily Carter's Loan Denial</h1>
      <p className="text-sm text-muted-foreground mb-6">Watch this short video to see what happened.</p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-panel overflow-hidden p-0"
      >
        <video
          src={caseVideo.url}
          controls
          playsInline
          preload="metadata"
          className="w-full aspect-video bg-muted"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="glass-panel mt-5 p-4 flex items-start gap-3"
      >
        <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-secondary-foreground">
          <strong className="text-foreground">Your role:</strong> you're on Credix's AI Ethics Team. Investigate the decision and design a clearer, fairer explanation for Emily.
        </p>
      </motion.div>

      <div className="flex justify-end mt-8">
        <button onClick={() => { sfx.navigate(); onNext(); }} className="btn-mission flex items-center gap-2">
          Start the Investigation
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default CaseVideo;
