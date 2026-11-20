import type { ProjectId } from './lens';

export type SkillGroup = { id: string; label: string; skills: { name: string; usedIn: ProjectId[] }[] };

// Only map a skill to a project when the resume or repo shows it was used there.
export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    label: 'Languages',
    skills: [
      { name: 'Python', usedIn: ['turingserve', 'guardml', 'adaptiverag', 'olist'] },
      { name: 'SQL (joins, CTEs, window functions)', usedIn: ['olist'] },
      { name: 'C', usedIn: [] }
    ]
  },
  {
    id: 'ml',
    label: 'ML & AI',
    skills: [
      { name: 'PyTorch', usedIn: [] },
      { name: 'TensorFlow', usedIn: [] },
      { name: 'Keras', usedIn: [] },
      { name: 'scikit-learn', usedIn: ['olist'] },
      { name: 'Transformers', usedIn: [] },
      { name: 'OpenCV', usedIn: [] },
      { name: 'NLP', usedIn: ['adaptiverag'] }
    ]
  },
  {
    id: 'llm',
    label: 'LLM systems',
    skills: [
      { name: 'RAG', usedIn: ['adaptiverag'] },
      { name: 'Embeddings', usedIn: ['adaptiverag'] },
      { name: 'FAISS + BM25', usedIn: ['adaptiverag'] },
      { name: 'Ollama', usedIn: ['adaptiverag'] },
      { name: 'Triton + CUDA', usedIn: ['turingserve'] },
      { name: 'Agent and tool safety', usedIn: ['guardml'] },
      { name: 'Prompt-injection evaluation', usedIn: ['guardml'] },
      { name: 'LLM workflows', usedIn: [] },
      { name: 'Semantic routing', usedIn: [] },
      { name: 'Asynchronous inference', usedIn: [] },
      { name: 'Prompt engineering', usedIn: [] },
      { name: 'REST APIs', usedIn: ['turingserve'] }
    ]
  },
  {
    id: 'testing',
    label: 'Testing & evaluation',
    skills: [
      { name: 'Automated testing', usedIn: ['turingserve', 'guardml', 'olist'] },
      { name: 'Adversarial evaluation', usedIn: ['guardml'] },
      { name: 'Benchmarking', usedIn: ['turingserve', 'guardml', 'adaptiverag'] },
      { name: 'CI regression checks', usedIn: ['guardml'] }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics & BI',
    skills: [
      { name: 'Power BI (data model, DAX)', usedIn: ['olist'] },
      { name: 'Excel', usedIn: ['olist'] },
      { name: 'pandas', usedIn: ['olist'] },
      { name: 'NumPy', usedIn: [] },
      { name: 'Matplotlib', usedIn: [] }
    ]
  },
  {
    id: 'stats',
    label: 'Statistics',
    skills: [
      { name: 'Hypothesis testing', usedIn: ['olist'] },
      { name: 'Confidence intervals / bootstrap', usedIn: ['adaptiverag'] },
      { name: 'Cohort analysis', usedIn: ['olist'] },
      { name: 'Regression', usedIn: ['olist'] },
      { name: 'Experiment design', usedIn: ['olist'] },
      { name: 'Data-quality testing', usedIn: ['olist'] }
    ]
  },
  {
    id: 'mlops',
    label: 'MLOps & systems',
    skills: [
      { name: 'MLflow', usedIn: ['guardml'] },
      { name: 'DVC', usedIn: ['guardml'] },
      { name: 'Docker', usedIn: ['guardml'] },
      { name: 'Kubernetes', usedIn: [] },
      { name: 'Git & GitHub', usedIn: [] },
      { name: 'Linux', usedIn: [] }
    ]
  }
];

export const alsoFamiliar = ['Tableau', 'Generative AI', 'AWS (Cloud, Data Engineering)'];
