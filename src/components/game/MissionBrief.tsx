import { motion } from 'framer-motion';
import { AlertTriangle, Shield, ArrowRight, Database, Brain, MonitorSmartphone, RefreshCcw } from 'lucide-react';
import { sfx } from '@/hooks/useSoundEffects';

interface MissionBriefProps {
  onNext: () => void;
}

const MissionBrief = ({ onNext }: MissionBriefProps) => {
  const lifecycleStages = [
    { label: 'Data Stage', description: 'What information is collected and used', icon: Database },
    { label: 'Model Stage', description: 'How the system makes decisions', icon: Brain },
    { label: 'Deployment Stage', description: 'How decisions are shown to users', icon: MonitorSmartphone },
    { label: 'Monitoring Stage', description: 'How decisions are reviewed and improved over time', icon: RefreshCcw },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto px-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="p-3 rounded-xl bg-accent/10 border border-accent/30">
          <AlertTriangle className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="section-label text-accent">Alert</p>
          <h1 className="text-2xl sm:text-3xl font-bold">Loan Decision Under Review</h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-6 sm:p-8 space-y-4 text-secondary-foreground leading-relaxed"
      >
        <p>
          <strong className="text-foreground">Credix</strong> is a digital lending platform that uses an automated system to review and decide on loan applications. The system evaluates information such as income, existing debt, and recent financial activity to determine approval or denial.
        </p>
        <p>
          A recent application by <strong className="text-foreground">Emily Carter</strong> was denied. She received a short message saying her application was considered <span className="text-danger font-medium">"high risk."</span>
        </p>
        <p>
          Emily has filed a complaint — she does not understand why she was denied or what she can do next. Similar complaints are increasing from other users.
        </p>

        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-foreground mb-1">You are part of Credix's AI Ethics Response Team.</p>
              <p className="text-sm text-muted-foreground">Your task: review the decision, identify what's missing, and redesign the explanation to be clearer, more helpful, and more transparent.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="glass-panel mt-5 w-full p-4 sm:p-5"
      >
        <p className="section-label mb-3">How AI Systems Work</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {lifecycleStages.map(stage => {
            const Icon = stage.icon;
            return (
              <div key={stage.label} className="rounded-lg border border-border bg-muted/40 p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">{stage.label}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{stage.description}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Transparency and explainability can be improved at each of these stages.
        </p>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={() => { sfx.navigate(); onNext(); }}
        className="btn-mission mt-8 flex items-center gap-2"
      >
        Enter Control Room
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default MissionBrief;
