import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { sfx } from '@/hooks/useSoundEffects';

interface StepLayoutProps {
  stepNumber: number;
  title: string;
  instruction: ReactNode;
  children: ReactNode;
  width?: 'narrow' | 'wide';
  onBack?: () => void;
  backLabel?: string;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hint?: ReactNode;
}

const TOTAL_STEPS = 5;

const StepLayout = ({
  stepNumber,
  title,
  instruction,
  children,
  width = 'narrow',
  onBack,
  backLabel = 'Back',
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  hint,
}: StepLayoutProps) => {
  const maxW = width === 'wide' ? 'max-w-5xl' : 'max-w-3xl';

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`${maxW} mx-auto px-4`}>
      <div className="mb-8">
        <p className="step-eyebrow mb-2">Step {stepNumber} of {TOTAL_STEPS}</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-base text-muted-foreground max-w-2xl">{instruction}</p>
      </div>

      {children}

      {/* Bottom action bar */}
      <div className="sticky bottom-0 z-30 mt-10 -mx-4 px-4 py-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-between gap-3">
          {onBack ? (
            <button
              onClick={() => { sfx.navigate(); onBack(); }}
              className="btn-ghost-game flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{backLabel}</span>
              <span className="sm:hidden">Back</span>
            </button>
          ) : <span />}

          <div className="flex items-center gap-3">
            {hint && <p className="text-sm text-muted-foreground text-right hidden sm:block">{hint}</p>}
            {onNext && (
              <button
                onClick={() => { if (!nextDisabled) { sfx.navigate(); onNext(); } }}
                disabled={nextDisabled}
                className="btn-mission flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {nextLabel}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {hint && <p className="text-xs text-muted-foreground mt-2 sm:hidden">{hint}</p>}
      </div>
    </motion.div>
  );
};

export default StepLayout;
