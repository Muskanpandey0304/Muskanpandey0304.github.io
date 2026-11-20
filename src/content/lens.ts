export type Lens = 'ml' | 'data';
export type ProjectId = 'turingserve' | 'guardml' | 'adaptiverag' | 'olist';

export const lensCopy: Record<
  Lens,
  {
    label: string;
    short: string;
    role: string;
    sub: string;
    cta: { label: string; href: string };
    projectOrder: ProjectId[];
    proofOrder: string[];
    skillOrder: string[];
    title: string;
  }
> = {
  ml: {
    label: 'ML Engineer',
    short: 'ML',
    role: 'AI/ML Engineer · LLM systems · Evaluation',
    sub: 'I build LLM systems, from inference kernels to RAG to agent safety, and benchmark every one of them.',
    cta: { label: 'View work', href: '#work' },
    projectOrder: ['turingserve', 'guardml', 'adaptiverag', 'olist'],
    proofOrder: ['prefill', 'sih', 'hit5', 'orders', 'tests', 'attack'],
    skillOrder: ['languages', 'ml', 'llm', 'testing', 'mlops', 'analytics', 'stats'],
    title: 'Muskan Pandey · AI/ML Engineer'
  },
  data: {
    label: 'Data Analyst',
    short: 'Data',
    role: 'Data Analyst · SQL · Python · Power BI',
    sub: 'I turn messy data into numbers you can trust and ranked recommendations you can act on.',
    cta: { label: 'View the Olist analysis', href: '#olist' },
    projectOrder: ['olist', 'adaptiverag', 'guardml', 'turingserve'],
    proofOrder: ['orders', 'tests', 'hit5', 'sih', 'prefill', 'attack'],
    skillOrder: ['languages', 'analytics', 'stats', 'ml', 'llm', 'mlops'],
    title: 'Muskan Pandey · Data Analyst'
  }
};
