import { Clock } from 'lucide-react';
import { formatTime, getStepTimeLimit } from '@/hooks/useActivityTimer';

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
  isStepOvertime,
}: ActivityTimerProps) => {
  const stepLimit = getStepTimeLimit(currentStep);
  const lowTime = !isStepOvertime && stepRemaining <= 60;

  const tone = isStepOvertime
    ? 'border-danger/40 bg-danger/10 text-danger'
    : lowTime
      ? 'border-warning/40 bg-warning/10 text-warning'
      : 'border-border bg-card text-foreground';

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${tone}`} title="Suggested time for this step">
        <Clock className="w-4 h-4" />
        <span className="font-mono font-medium tabular-nums">
          {isStepOvertime ? `+${formatTime(stepElapsed - stepLimit)}` : formatTime(stepRemaining)}
        </span>
        <span className="hidden sm:inline text-xs opacity-80">{isStepOvertime ? 'over' : 'left'}</span>
      </div>
      <span className="hidden md:inline text-xs text-muted-foreground">
        {formatTime(totalRemaining)} total
      </span>
    </div>
  );
};

export default ActivityTimer;
