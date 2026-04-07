import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = [
  'Mission Brief',
  'Evidence Board',
  'Diagnose',
  'Build',
  'Test',
  'Reflect',
];

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;

        return (
          <div key={label} className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-1.5">
              <motion.div
                className={`step-indicator text-xs ${
                  isActive ? 'step-active' : isComplete ? 'step-complete' : 'step-inactive'
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isComplete ? <Check className="w-3.5 h-3.5" /> : stepNum}
              </motion.div>
              <span className={`hidden md:inline text-xs ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-4 sm:w-8 h-px ${isComplete ? 'bg-primary/40' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
