import { Clock } from 'lucide-react';
import { formatTime } from '@/hooks/useActivityTimer';

interface ActivityTimerProps {
  totalRemaining: number;
  isTimeUp: boolean;
}

const ActivityTimer = ({ totalRemaining, isTimeUp }: ActivityTimerProps) => {
  const lowTime = !isTimeUp && totalRemaining <= 5 * 60;

  const tone = isTimeUp
    ? 'border-danger/40 bg-danger/10 text-danger'
    : lowTime
      ? 'border-warning/40 bg-warning/10 text-warning'
      : 'border-border bg-card text-foreground';

  return (
    <div className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${tone}`} title="Time left for the whole case study">
      <Clock className="w-4 h-4" />
      {isTimeUp ? (
        <span className="font-medium">Time's up</span>
      ) : (
        <>
          <span className="font-mono font-medium tabular-nums">{formatTime(totalRemaining)}</span>
          <span className="hidden sm:inline text-xs opacity-80">left</span>
        </>
      )}
    </div>
  );
};

export default ActivityTimer;
