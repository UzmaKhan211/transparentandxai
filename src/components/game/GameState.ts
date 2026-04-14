export interface QuizResult {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface GameState {
  step: number;
  // Step 0: Concept Check
  quizResults: QuizResult[];
  quizScore: number;
  quizTotal: number;
  // Step 3: Diagnose
  missingInfo: string[];
  biggestProblem: string;
  freeResponse: string;
  // Step 4: Build
  selectedElements: string[];
  // Step 6: Reflect
  reflections: Record<string, string>;
  revisedElements: string[];
}

export const initialGameState: GameState = {
  step: 1,
  quizResults: [],
  quizScore: 0,
  quizTotal: 0,
  missingInfo: [],
  biggestProblem: '',
  freeResponse: '',
  selectedElements: [],
  reflections: {},
  revisedElements: [],
};

export const EXPLANATION_OPTIONS = [
  { id: 'why-denied', label: 'Explain why the application was denied', preview: 'Your application was not approved because your risk score exceeded our approval threshold.' },
  { id: 'main-factors', label: 'Show the main factors that affected the decision', preview: 'The main factors were: high debt-to-income ratio (42%), multiple recent credit inquiries (4 in 3 months), and contract employment status.' },
  { id: 'risk-score', label: 'Show the risk score and what it means', preview: 'Your risk score was 0.76 out of 1.0. Applications scoring above 0.70 are considered high risk. A lower score indicates lower risk.' },
  { id: 'data-used', label: 'Explain what information was used', preview: 'We evaluated your annual income, credit score, existing debt, employment type, and recent credit activity.' },
  { id: 'improve-steps', label: 'Suggest steps to improve eligibility', preview: 'You may improve your chances by reducing your existing debt, limiting new credit applications, or providing proof of stable long-term employment.' },
  { id: 'request-review', label: 'Allow the user to request a review', preview: 'If you believe this decision is incorrect, you can request a manual review within 30 days by contacting our support team.' },
  { id: 'correct-info', label: 'Allow the user to correct their information', preview: 'If any of the information used is inaccurate, you can submit updated documents through your account portal.' },
  { id: 'simple-explanation', label: 'Provide a simple, easy-to-understand explanation', preview: 'In simple terms: we compared your debt to your income, and right now, the amount you owe is high relative to what you earn. This, combined with recent credit activity, increased your risk level.' },
  { id: 'detailed-explanation', label: 'Provide a more detailed explanation', preview: 'Your debt-to-income ratio of 42% exceeds our preferred maximum of 35%. Additionally, 4 credit inquiries in 3 months suggests active credit-seeking behavior, which is a risk signal. Contract employment carries a stability risk modifier of 1.2x compared to full-time employment.' },
  { id: 'not-considered', label: 'Explain what the system does not take into account', preview: 'Please note: our system does not consider your payment history, savings, or personal circumstances. These factors may be considered if you request a manual review.' },
];

export function generatePreview(selectedIds: string[]): string {
  if (selectedIds.length === 0) return '';
  const parts: string[] = [];
  const opts = EXPLANATION_OPTIONS.filter(o => selectedIds.includes(o.id));
  for (const opt of opts) {
    parts.push(opt.preview);
  }
  return parts.join('\n\n');
}

export interface FeedbackResult {
  persona: string;
  role: string;
  sentiment: 'positive' | 'warning' | 'negative';
  message: string;
}

export function generateFeedback(selectedIds: string[]): FeedbackResult[] {
  const results: FeedbackResult[] = [];
  
  // Emily
  const hasWhy = selectedIds.includes('why-denied') || selectedIds.includes('simple-explanation');
  const hasSteps = selectedIds.includes('improve-steps');
  const hasReview = selectedIds.includes('request-review');
  const hasDetailed = selectedIds.includes('detailed-explanation');
  const hasScore = selectedIds.includes('risk-score');
  
  if (hasWhy && hasSteps) {
    results.push({ persona: 'Emily Carter', role: 'Applicant', sentiment: 'positive', message: "This helps me understand what affected my application, and I know what I can do to improve. Thank you." });
  } else if (hasWhy && !hasSteps) {
    results.push({ persona: 'Emily Carter', role: 'Applicant', sentiment: 'warning', message: "I understand the reason now, but I still don't know what I can do next. What steps should I take?" });
  } else {
    results.push({ persona: 'Emily Carter', role: 'Applicant', sentiment: 'negative', message: "I'm still confused. The message doesn't clearly explain why I was denied. This feels the same as before." });
  }

  // Product Manager
  if (selectedIds.length <= 5 && hasWhy) {
    if (hasDetailed || hasScore) {
      results.push({ persona: 'Jordan Lee', role: 'Product Manager', sentiment: 'warning', message: "The explanation is thorough, but might overwhelm users who aren't familiar with financial terms. Consider simpler language." });
    } else {
      results.push({ persona: 'Jordan Lee', role: 'Product Manager', sentiment: 'positive', message: "This is clear and easy to follow. Good balance of information without overwhelming the user." });
    }
  } else if (selectedIds.length > 5) {
    results.push({ persona: 'Jordan Lee', role: 'Product Manager', sentiment: 'warning', message: "There's a lot of information here. Users might not read it all. Consider prioritizing the most important points." });
  } else {
    results.push({ persona: 'Jordan Lee', role: 'Product Manager', sentiment: 'warning', message: "The message could use more context so users understand what happened and why." });
  }

  // Compliance
  if (hasReview && (hasWhy || selectedIds.includes('main-factors'))) {
    results.push({ persona: 'Dr. Priya Sharma', role: 'Compliance Reviewer', sentiment: 'positive', message: "This explanation supports user understanding and provides a clear path to challenge the decision. It meets our transparency guidelines." });
  } else if (!hasReview) {
    results.push({ persona: 'Dr. Priya Sharma', role: 'Compliance Reviewer', sentiment: 'warning', message: "This improves transparency, but users still don't have a clear way to challenge the decision. Consider adding a review option." });
  } else {
    results.push({ persona: 'Dr. Priya Sharma', role: 'Compliance Reviewer', sentiment: 'positive', message: "Good inclusion of the review mechanism. Adding more detail about the factors would strengthen compliance." });
  }

  return results;
}
