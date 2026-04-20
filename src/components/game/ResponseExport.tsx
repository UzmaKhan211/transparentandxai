import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, CheckCircle2, FileText } from 'lucide-react';
import { GameState, EXPLANATION_OPTIONS, generatePreview, generateFeedback, QuizResult } from './GameState';
import { sfx } from '@/hooks/useSoundEffects';

interface ResponseExportProps {
  state: GameState;
}

const REFLECTION_QUESTIONS = [
  'What did you change after seeing the feedback?',
  'How did you decide what information to include or leave out?',
  'How did you balance being clear with not overwhelming the user?',
  'Do you think your explanation fully solves the problem? Why or why not?',
];

const LIFECYCLE_PROMPTS = [
  'Design: What transparency or explainability choice should be built in before deployment?',
  'Deployment: What should users be told when an AI decision is shown to them?',
  'Monitoring: What should a team keep checking after launch to make the system more accountable?',
];

function buildPlainTextReport(state: GameState): string {
  const lines: string[] = [];
  const sep = '─'.repeat(50);

  lines.push('STUDENT RESPONSE REPORT');
  lines.push('Explainability & Transparency in AI — Classroom Activity');
  lines.push(`Date: ${new Date().toLocaleDateString()}`);
  lines.push(sep);

  lines.push('');
  lines.push('SECTION 1: CONCEPT CHECK');
  lines.push(sep);
  lines.push(`Score: ${state.quizScore} / ${state.quizTotal}`);
  if (state.quizResults.length > 0) {
    state.quizResults.forEach((r, i) => {
      lines.push('');
      lines.push(`Q${i + 1}. ${r.question}`);
      lines.push(`  Student answered: ${r.selectedAnswer}`);
      lines.push(`  Correct answer:   ${r.correctAnswer}`);
      lines.push(`  Result: ${r.isCorrect ? '✓ Correct' : '✗ Incorrect'}`);
    });
  } else {
    lines.push('  (No quiz data recorded)');
  }

  lines.push('');
  lines.push('SECTION 2: DIAGNOSE THE PROBLEM');
  lines.push(sep);
  lines.push('');
  lines.push('Q1. What important information is missing?');
  if (state.missingInfo.length > 0) {
    state.missingInfo.forEach(m => lines.push(`  • ${m}`));
  } else {
    lines.push('  (No selections made)');
  }

  lines.push('');
  lines.push('Q2. Biggest problem with the current message:');
  lines.push(`  ${state.biggestProblem || '(No selection made)'}`);

  lines.push('');
  lines.push('Q3. Why the current explanation is not helpful:');
  lines.push(`  ${state.freeResponse || '(No response)'}`);

  lines.push('');
  lines.push('SECTION 3: EXPLANATION DESIGN');
  lines.push(sep);
  lines.push('');
  lines.push('Selected elements (initial):');
  const initialOpts = EXPLANATION_OPTIONS.filter(o => state.selectedElements.includes(o.id));
  if (initialOpts.length > 0) {
    initialOpts.forEach(o => lines.push(`  • ${o.label}`));
  } else {
    lines.push('  (No elements selected)');
  }

  const finalElements = state.revisedElements.length > 0 ? state.revisedElements : state.selectedElements;
  if (state.revisedElements.length > 0) {
    lines.push('');
    lines.push('Revised elements (after feedback):');
    const revisedOpts = EXPLANATION_OPTIONS.filter(o => state.revisedElements.includes(o.id));
    revisedOpts.forEach(o => lines.push(`  • ${o.label}`));
  }

  lines.push('');
  lines.push('Final explanation sent to Emily:');
  lines.push(sep);
  const preview = generatePreview(finalElements);
  lines.push(preview || '(No explanation generated)');
  lines.push(sep);

  lines.push('');
  lines.push('SECTION 4: STAKEHOLDER FEEDBACK');
  lines.push(sep);
  const feedback = generateFeedback(finalElements);
  feedback.forEach(fb => {
    lines.push('');
    lines.push(`${fb.persona} (${fb.role}) — ${fb.sentiment.toUpperCase()}`);
    lines.push(`  "${fb.message}"`);
  });

  lines.push('');
  lines.push('SECTION 5: REFLECTIONS');
  lines.push(sep);
  REFLECTION_QUESTIONS.forEach((q, i) => {
    lines.push('');
    lines.push(`Q${i + 1}. ${q}`);
    lines.push(`  ${state.reflections[q] || '(No response)'}`);
  });

  lines.push('');
  lines.push('SECTION 6: AI LIFECYCLE GOVERNANCE');
  lines.push(sep);
  LIFECYCLE_PROMPTS.forEach((q, i) => {
    lines.push('');
    lines.push(`Q${i + 1}. ${q}`);
    lines.push(`  ${state.lifecycleNotes[q] || '(No response)'}`);
  });

  lines.push('');
  lines.push(sep);
  lines.push('End of Report');

  return lines.join('\n');
}

const ResponseExport = ({ state }: ResponseExportProps) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleDownload = () => {
    sfx.success();
    const report = buildPlainTextReport(state);
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethics-lab-response-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailSend = () => {
    if (!emailAddress.trim()) return;
    sfx.submit();
    const report = buildPlainTextReport(state);
    const subject = encodeURIComponent('Explainability & Transparency Activity - Student Response');
    const body = encodeURIComponent(report);
    window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, '_blank');
    setEmailSent(true);
  };

  return (
    <div className="space-y-3 flex flex-col items-center">
      <p className="section-label flex items-center gap-2">
        <FileText className="w-3.5 h-3.5" />
        Share Your Responses
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={handleDownload}
          className="btn-outline-game flex items-center gap-2 text-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Download Report
        </button>

        <button
          onClick={() => { setShowEmailInput(!showEmailInput); sfx.click(); }}
          className="btn-outline-game flex items-center gap-2 text-sm"
        >
          <Mail className="w-3.5 h-3.5" />
          Email to Instructor
        </button>
      </div>

      {showEmailInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="overflow-hidden"
        >
          <div className="glass-panel p-4 mt-2">
            {!emailSent ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={e => setEmailAddress(e.target.value)}
                  placeholder="instructor@university.edu"
                  className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleEmailSend}
                  disabled={!emailAddress.includes('@')}
                  className={`btn-mission text-sm px-4 py-2 ${!emailAddress.includes('@') ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  Send
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-[hsl(var(--success))]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Email client opened — send the email from your mail app.</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              This will open your email client with the report pre-filled. Your instructor will receive a clean, easy-to-read summary.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResponseExport;
