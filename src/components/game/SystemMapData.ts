import { AI_LIFECYCLE_STAGES } from './GameState';

export interface SystemMapFix {
  id: string;
  label: string;
  correct: boolean;
  correctStages: string[]; // which stages this fix is appropriate at
}

export interface SystemMapIssue {
  id: string;
  text: string;
  correctStages: string[];
  fixes: SystemMapFix[];
}

export const SYSTEM_MAP_STAGE_OPTIONS = [...AI_LIFECYCLE_STAGES];

export const SYSTEM_MAP_ISSUES: SystemMapIssue[] = [
  {
    id: 'issue-1',
    text: 'User does not understand why their application was denied',
    correctStages: ['Deployment Stage'],
    fixes: [
      { id: 'fix-1a', label: 'Provide clear explanation with key factors', correct: true, correctStages: ['Deployment Stage'] },
      { id: 'fix-1b', label: 'Add plain language explanation', correct: true, correctStages: ['Deployment Stage'] },
      { id: 'fix-1c', label: 'Allow users to correct their data', correct: false, correctStages: ['Data Stage'] },
      { id: 'fix-1d', label: 'Add appeal process', correct: false, correctStages: ['Monitoring Stage'] },
    ],
  },
  {
    id: 'issue-2',
    text: 'Important factors influencing the decision are not visible',
    correctStages: ['Model Stage'],
    fixes: [
      { id: 'fix-2a', label: 'Show top contributing factors', correct: true, correctStages: ['Model Stage'] },
      { id: 'fix-2b', label: 'Provide feature importance summary', correct: true, correctStages: ['Model Stage'] },
      { id: 'fix-2c', label: 'Add appeal button', correct: false, correctStages: ['Monitoring Stage'] },
      { id: 'fix-2d', label: 'Simplify message wording', correct: false, correctStages: ['Deployment Stage'] },
    ],
  },
  {
    id: 'issue-3',
    text: 'User cannot correct incorrect or outdated information',
    correctStages: ['Data Stage'],
    fixes: [
      { id: 'fix-3a', label: 'Allow users to review and update their data', correct: true, correctStages: ['Data Stage'] },
      { id: 'fix-3b', label: 'Show what data was used', correct: true, correctStages: ['Data Stage'] },
      { id: 'fix-3c', label: 'Add technical explanation', correct: false, correctStages: ['Model Stage'] },
      { id: 'fix-3d', label: 'Show confidence score', correct: false, correctStages: ['Model Stage'] },
    ],
  },
  {
    id: 'issue-4',
    text: 'There is no way to challenge or review the decision',
    correctStages: ['Monitoring Stage'],
    fixes: [
      { id: 'fix-4a', label: 'Add appeal or review process', correct: true, correctStages: ['Monitoring Stage'] },
      { id: 'fix-4b', label: 'Include human oversight for edge cases', correct: true, correctStages: ['Monitoring Stage'] },
      { id: 'fix-4c', label: 'Show feature importance', correct: false, correctStages: ['Model Stage'] },
      { id: 'fix-4d', label: 'Provide plain language explanation', correct: false, correctStages: ['Deployment Stage'] },
    ],
  },
];

export interface SystemMapAnswer {
  stage: string;
  fixId: string;
}

export interface SystemMapEvaluation {
  issueId: string;
  stageCorrect: boolean;
  fixCorrect: boolean;
  combinationCorrect: boolean;
}

export function evaluateSystemMap(answers: Record<string, SystemMapAnswer>): SystemMapEvaluation[] {
  return SYSTEM_MAP_ISSUES.map(issue => {
    const ans = answers[issue.id];
    if (!ans || !ans.stage || !ans.fixId) {
      return { issueId: issue.id, stageCorrect: false, fixCorrect: false, combinationCorrect: false };
    }
    const fix = issue.fixes.find(f => f.id === ans.fixId);
    const stageCorrect = issue.correctStages.includes(ans.stage);
    const fixCorrect = !!fix?.correct;
    // Combination: fix is appropriate AND stage matches the fix's appropriate stage
    const combinationCorrect = fixCorrect && !!fix && fix.correctStages.includes(ans.stage);
    return { issueId: issue.id, stageCorrect, fixCorrect, combinationCorrect };
  });
}

export function buildSystemMapFeedback(evals: SystemMapEvaluation[], answers: Record<string, SystemMapAnswer>): string[] {
  const messages: string[] = [];
  const correctCount = evals.filter(e => e.combinationCorrect).length;

  if (correctCount === SYSTEM_MAP_ISSUES.length) {
    messages.push('You correctly identified where every issue originates and matched it with a strong fix.');
  } else if (correctCount >= 3) {
    messages.push('You correctly identified where most issues originate.');
  } else {
    messages.push('Some solutions do not match the selected lifecycle stage.');
  }

  // Stage distribution heuristic
  const stageCounts: Record<string, number> = {};
  Object.values(answers).forEach(a => {
    if (a?.stage) stageCounts[a.stage] = (stageCounts[a.stage] ?? 0) + 1;
  });
  const overused = Object.entries(stageCounts).find(([, n]) => n >= 3);
  if (overused) {
    const others = SYSTEM_MAP_STAGE_OPTIONS.filter(s => s !== overused[0]);
    messages.push(`You focused heavily on ${overused[0]}. Consider earlier or later stages like ${others.slice(0, 2).join(' and ')}.`);
  }

  const stageMistakes = evals.filter(e => !e.stageCorrect).length;
  if (stageMistakes > 0 && correctCount < SYSTEM_MAP_ISSUES.length) {
    messages.push('Think about where the problem originates, not just where it appears.');
  }

  return messages;
}
