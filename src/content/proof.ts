import type { ProjectId } from './lens';

export type Visual = 'race' | 'attack' | 'ring' | 'dots' | 'ticks' | 'years';

export type Proof = {
  id: string;
  kicker: string;
  value: number;
  decimals?: number;
  suffix?: string;
  /** Rendered instead of the animated number (e.g. "100% → 5%"). */
  custom?: 'attack';
  caption: string;
  visual: Visual;
  target: ProjectId | 'record';
};

// Every figure comes from the resumes. Visuals only restate those numbers.
export const proofs: Proof[] = [
  { id: 'prefill', kicker: 'LLM inference · TuringServe', value: 6.6, decimals: 1, suffix: '×', caption: 'faster long-prompt prefill than vLLM on a Tesla T4 (1.7 s vs 11.1 s)', visual: 'race', target: 'turingserve' },
  { id: 'attack', kicker: 'Agent safety · GuardML', value: 5, custom: 'attack', caption: 'prompt-injection success with guards on (62-scenario GuardBench, offline worst case)', visual: 'attack', target: 'guardml' },
  { id: 'hit5', kicker: 'Retrieval · AdaptiveRAG', value: 0.93, decimals: 2, caption: 'held-out hit@5: the right page is in the top 5 results (27 questions)', visual: 'ring', target: 'adaptiverag' },
  { id: 'orders', kicker: 'Analytics · Olist', value: 100, suffix: 'k', caption: 'e-commerce orders analysed with SQL and Python', visual: 'dots', target: 'olist' },
  { id: 'tests', kicker: 'Data quality · Olist', value: 20, caption: 'automated data-quality tests that recalculate revenue and the late rate from the raw files', visual: 'ticks', target: 'olist' },
  { id: 'sih', kicker: 'Hackathons', value: 2, suffix: '×', caption: 'Smart India Hackathon winner', visual: 'years', target: 'record' }
];

/** Scrolling strip of real results (between the hero and the Receipts). */
export const ticker = [
  '328 tests · 2-hour soak, 40,188 requests, zero errors',
  '62-scenario GuardBench: 100% → 5% attack success (offline worst case)',
  'AgentDojo banking slice (40 cases): 65% → 0% attack success',
  '0.73 nDCG@10 on SciFact (BEIR), no tuning',
  'ROC AUC 0.72 on unseen months',
  '20 automated data-quality tests',
  '4-page Power BI dashboard · 9-table star schema · 16 DAX measures',
  'late first order vs repeat purchase within 90 days: p = 0.15',
  'R$1.5M upper-bound opportunity, with an experiment designed to test it',
  'paged KV cache · continuous batching · INT8 weights · speculative decoding'
];
