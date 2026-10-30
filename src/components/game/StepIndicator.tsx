import { Check } from 'lucide-react';

const STEPS = ['Evidence', 'Diagnose', 'System Map', 'Build', 'Test'];

// App steps start at 2 (Evidence); display numbers start at 1.
const FIRST_STEP = 2;

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <ol className="grid grid-cols-5 gap-2" aria-label="Progress">
      {STEPS.map((label, i) => {
        const stepIndex = i + FIRST_STEP;
        const isActive = stepIndex === currentStep;
        const isComplete = stepIndex < currentStep;
        return (
          <li key={label} className="flex flex-col gap-1.5" aria-current={isActive ? 'step' : undefined}>
            <div
              className={`h-1.5 rounded-full transition-colors duration-500 ${
                isComplete || isActive ? 'bg-primary' : 'bg-muted'
              } ${isActive ? 'opacity-100' : isComplete ? 'opacity-60' : ''}`}
            />
            <span
              className={`flex items-center gap-1 text-xs truncate ${
                isActive ? 'text-primary font-semibold' : isComplete ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {isComplete && <Check className="w-3 h-3 shrink-0" />}
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default StepIndicator;
