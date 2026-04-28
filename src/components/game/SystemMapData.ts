import { AI_LIFECYCLE_STAGES } from './GameState';

export interface SystemMapIssue {
  id: string;
  text: string;
  suggestedStage: string;
  rationale: string;
}

export const SYSTEM_MAP_STAGE_OPTIONS = [...AI_LIFECYCLE_STAGES];

export const SYSTEM_MAP_ISSUES: SystemMapIssue[] = [
  {
    id: 'issue-1',
    text: 'User does not understand why their application was denied',
    suggestedStage: 'Deployment Stage',
    rationale: 'This is primarily a Deployment Stage issue — it concerns how the decision and its reasoning are communicated to the user at the point of interaction.',
  },
  {
    id: 'issue-2',
    text: 'Important factors influencing the decision are not visible',
    suggestedStage: 'Model Stage',
    rationale: 'This is best addressed at the Model Stage — the system needs to surface which features and weights drove the decision (e.g., feature importance, key signals).',
  },
  {
    id: 'issue-3',
    text: 'User cannot correct incorrect or outdated information',
    suggestedStage: 'Data Stage',
    rationale: 'This belongs to the Data Stage — it concerns the integrity of the inputs and giving users a way to update or contest the data used about them.',
  },
  {
    id: 'issue-4',
    text: 'There is no way to challenge or review the decision',
    suggestedStage: 'Monitoring Stage',
    rationale: 'This is a Monitoring Stage issue — appeals, audits, and human review processes are how decisions are reviewed and improved over time.',
  },
];

export const LIFECYCLE_STAGE_DESCRIPTIONS: { stage: string; short: string }[] = [
  { stage: 'Data Stage', short: 'What information is collected and used' },
  { stage: 'Model Stage', short: 'How the system makes decisions' },
  { stage: 'Deployment Stage', short: 'How decisions are shown to users' },
  { stage: 'Monitoring Stage', short: 'How the system is reviewed and improved' },
];

export function buildSystemThinkingInsight(
  responses: Record<string, { stage: string; explanation: string }>
): string[] {
  const messages: string[] = [
    "You've identified how issues can be addressed across different stages of the system.",
  ];

  const stageCounts: Record<string, number> = {};
  Object.values(responses).forEach(r => {
    if (r?.stage) stageCounts[r.stage] = (stageCounts[r.stage] ?? 0) + 1;
  });

  const stagesUsed = Object.keys(stageCounts).length;
  if (stagesUsed <= 2 && Object.keys(responses).length >= 3) {
    messages.push('Some issues may also be addressed earlier in the lifecycle.');
  }

  messages.push('Transparency can be improved at multiple stages, not just where users see the final decision.');
  return messages;
}
