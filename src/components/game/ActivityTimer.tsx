import { motion } from 'framer-motion';
import { Clock, Timer } from 'lucide-react';
import { formatTime, getStepTimeLimit, STEP_LABELS } from '@/hooks/useActivityTimer';

interface ActivityTimerProps {
  totalRemaining: number;
  stepRemaining: number;
  stepElapsed: number;
  currentStep: number;
  isOvertime: boolean;
  isStepOvertime: boolean;
}

const ActivityTimer = ({
  totalRemaining,
  stepRemaining,
  stepElapsed,
  currentStep,
  isOvertime,
  isStepOvertime,
}: ActivityTimerProps) => {
  const stepLimit = getStepTimeLimit(currentStep);
  const stepLabel = STEP_LABELS[currentStep] ?? '';
  const stepProgress = stepLimit > 0 ? Math.min(1, stepElapsed / stepLimit) : 0;

  return (
    <div className="flex items-center gap-4 text-xs font-mono">
      {/* Step timer */}
      <div className="flex items-center gap-1.5">
        <Timer className={`w-3.5 h-3.5 ${isStepOvertime ? 'text-[hsl(var(--danger))]' : 'text-muted-foreground'}`} />
        <span className="text-muted-foreground hidden sm:inline">{stepLabel}:</span>
        <span className={`font-medium ${isStepOvertime ? 'text-[hsl(var(--danger))]' : 'text-foreground'}`}>
          {isStepOvertime ? '+' : ''}{formatTime(isStepOvertime ? stepElapsed - stepLimit : stepRemaining)}
        </span>
        {/* Mini progress bar */}
        <div className="w-12 h-1 bg-muted rounded-full overflow-hidden hidden sm:block">
          <motion.div
            className={`h-full rounded-full ${isStepOvertime ? 'bg-[hsl(var(--danger))]' : stepProgress > 0.8 ? 'bg-[hsl(var(--warning))]' : 'bg-primary'}`}
            animate={{ width: `${Math.min(100, stepProgress * 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="w-px h-4 bg-border" />

      {/* Total timer */}
      <div className="flex items-center gap-1.5">
        <Clock className={`w-3.5 h-3.5 ${isOvertime ? 'text-[hsl(var(--danger))]' : 'text-muted-foreground'}`} />
        <span className="text-muted-foreground hidden sm:inline">Total:</span>
        <span className={`font-medium ${isOvertime ? 'text-[hsl(var(--danger))]' : totalRemaining < 5 * 60 ? 'text-[hsl(var(--warning))]' : 'text-foreground'}`}>
          {isOvertime ? '+' + formatTime(Math.abs(totalRemaining)) : formatTime(totalRemaining)}
        </span>
      </div>
    </div>
  );
};

export default ActivityTimer;
