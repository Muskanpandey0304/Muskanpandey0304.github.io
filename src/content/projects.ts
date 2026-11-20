import { repo } from './profile';
import type { ProjectId } from './lens';

/**
 * FACT-CHECKED against the public GitHub repos (see FACT_CHECK.md at the project root).
 * Every number below appears in the repo it belongs to, or in the resume. If a repo changes, change it here too.
 */
export type CaseStudy = {
  id: ProjectId;
  title: string;
  kicker: string;
  stack: string[];
  date: string;
  problem: string;
  built: string[];
  proved: string[];
  highlights: { n: string; l: string }[];
  /** "How I measured it": setup, metric, checks and an honest caveat, all taken from the repos. */
  method: { setup: string; metric: string; checks: string[]; caveat: string };
  links: { label: string; href: string }[];
};

export const caseStudies: Record<ProjectId, CaseStudy> = {
  turingserve: {
    id: 'turingserve',
    title: 'TuringServe',
    kicker: 'LLM inference server for Turing GPUs',
    stack: ['Python', 'Triton', 'CUDA'],
    date: 'Oct 2026',
    problem:
      'On Turing GPUs such as the free Kaggle and Colab T4, current attention kernels cannot use tensor cores (FlashAttention-2 needs sm80+, and recent Triton emits no tensor-core instructions below compute capability 8.0), so vLLM’s default attention runs on ordinary FMA units and long prompts prefill slowly.',
    built: [
      'An LLM inference server built from scratch in Python, Triton and CUDA for NVIDIA Turing GPUs, with an OpenAI-compatible API.',
      'Paged KV cache, continuous batching, chunked prefill, prefix caching, CUDA graphs, INT8 weights and speculative decoding.',
      'Triton tensor-core attention kernels, with torch 2.6.0 and Triton 3.2.0 pinned so they still use tensor cores on a T4.'
    ],
    proved: [
      '328 tests: 304 pass and 24 are skipped by design on a Kaggle T4.',
      'A 2-hour soak test sent 40,188 requests with zero errors and flat server memory.',
      '6.6× faster cold prefill than vLLM on a Tesla T4 for an 8,000-token prompt (1.7 s vs 11.1 s).',
      '38% higher output throughput than vLLM at 64 concurrent clients (1,805 vs 1,308 tokens/s).'
    ],
    highlights: [
      { n: '6.6×', l: 'faster cold prefill than vLLM (8,000 tokens)' },
      { n: '+38%', l: 'throughput at 64 concurrent clients' },
      { n: '328', l: 'tests, plus a 2-hour zero-error soak' }
    ],
    method: {
      setup:
        'One Kaggle Tesla T4 and Qwen2.5-1.5B-Instruct in fp16. TuringServe is compared with vLLM 0.33.0 (Triton attention on sm_75) and llama.cpp. Cold prefill uses an 8,000-token prompt with prefix caching off. Throughput uses a ShareGPT workload with 64 concurrent clients.',
      metric:
        'Cold prefill time in seconds (1.68 s vs 11.07 s, lower is better) and output tokens per second (1,805 vs 1,308, higher is better).',
      checks: [
        '328 tests: 115 CPU, unit and end-to-end tests plus 213 GPU-marked tests (189 pass on the T4 and 24 are skipped by design).',
        'A 2-hour soak: 40,188 requests, zero errors, server memory flat (1,687 to 1,689 MB).',
        'A chaos test (client disconnects, a 200-request burst, empty and invalid input) passed with a clean final state.',
        'The repo claims no performance number until it appears in a report generated from committed result files.'
      ],
      caveat:
        'One GPU and one model (a Tesla T4 and Qwen2.5-1.5B). INT8 halves weight memory but did not speed up decoding on the T4 (6 to 11% slower), a 0.5B draft model for speculation was slower than none, and the Autopilot controller showed no measurable benefit.'
    },
    links: [{ label: 'Source', href: repo('TuringServe') }]
  },
  guardml: {
    id: 'guardml',
    title: 'GuardML',
    kicker: 'Secure LLM agent and tool execution safety',
    stack: ['Python', 'MLflow', 'DVC', 'Docker'],
    date: 'Sep 2026',
    problem:
      'An LLM agent with tool access can be tricked by text it reads: a log line or run tag can contain instructions, and rules in the prompt are only suggestions to the model.',
    built: [
      'An MLOps diagnostic agent that works out why a model got worse, using MLflow, DVC and Docker tools.',
      'Safety enforced in code on every tool call, not in the prompt: typed argument validation, argument provenance, an isolated intent check, risk scoring, human approval, secret masking, snapshots with automatic rollback, and a hash-chained audit log.',
      'GuardBench, a built-in benchmark that measures how well the guard holds up.'
    ],
    proved: [
      'On my 62-scenario GuardBench (18 legitimate tasks and 44 attacks), attack success fell from 100% (44/44) to 5% (2/44) and all legitimate tasks still completed. This is the offline worst case, where the model is assumed to be already fooled.',
      'On the external AgentDojo benchmark (banking suite, 40 attack cases, a local 14B model), attack success fell from 65% (26/40) to 0% (0/40).',
      '659 tests, plus CI on every push with a regression gate on the benchmark.'
    ],
    highlights: [
      { n: '100→5%', l: 'attack success, offline worst case (44 attacks)' },
      { n: '65→0%', l: 'AgentDojo banking slice (40 cases)' },
      { n: '659', l: 'tests, with a CI benchmark gate' }
    ],
    method: {
      setup:
        'GuardBench runs 62 scenarios: 18 legitimate tasks and 44 attacks (direct and indirect prompt injection, argument bypass and approval bypass). An attack counts as successful only if the malicious tool call actually executed. The offline runs use a scripted agent that plays a model already fooled by the injection. AgentDojo: banking suite, qwen2.5:14b through Ollama, 8 user tasks × 5 injection tasks = 40 attack pairs.',
      metric: 'Attack success rate (lower is better), plus the share of legitimate tasks that still complete.',
      checks: [
        'Results are split by who wrote the attacks: held-out attacks written after the guard was frozen, attacks written blind by a fresh Claude Opus session, and a red team by the guard’s own author.',
        'A real MLflow store with real rollback: 0 of 7 attacks succeeded.',
        '659 tests, plus CI with a regression gate on the benchmark.'
      ],
      caveat:
        'The 5% needs ToolGuard plus argument provenance and no human in the loop; if a human rubber-stamps every approval it is 36% (16/44). On AgentDojo the guard also cost normal work: tasks completed fell from 5/8 to 3/8. The live-model test used one small model on 8 attacks, so it is only a sign, not a rate.'
    },
    links: [{ label: 'Source', href: repo('GuardML') }]
  },
  adaptiverag: {
    id: 'adaptiverag',
    title: 'AdaptiveRAG',
    kicker: 'Query-routed, citation-grounded RAG',
    stack: ['Python', 'FAISS', 'BM25', 'Ollama'],
    date: 'Oct 2026',
    problem: 'RAG systems tend to answer confidently even when nothing relevant was retrieved.',
    built: [
      'A question-answering system over 26 research papers, built from scratch (no LangChain or LlamaIndex), that runs entirely on your own machine with Ollama.',
      'A router that classifies each query before retrieval: simple queries skip retrieval, exact lookups try BM25 first, and everything else uses hybrid BM25 + vector search with Reciprocal Rank Fusion and a cross-encoder rerank.',
      'A confidence threshold that makes it say “Not found in the documents” instead of guessing.'
    ],
    proved: [
      'Finds the right page in the top 5 for 93% of held-out questions (hit@5 0.93; dev 0.88), with 95% bootstrap confidence intervals.',
      'On the outside SciFact (BEIR) benchmark, with no tuning: nDCG@10 0.73 (5,183 abstracts, 300 claims).',
      'Refused 12 of 12 off-topic held-out questions.'
    ],
    highlights: [
      { n: '0.93', l: 'held-out hit@5 (27 questions)' },
      { n: '0.73', l: 'nDCG@10 on SciFact (BEIR)' },
      { n: '12/12', l: 'off-topic held-out questions refused' }
    ],
    method: {
      setup:
        'The corpus is 26 arXiv papers (8,181 chunks). Retrieval is scored on a 49-question dev set and on a separate held-out set (27 in-scope and 12 off-topic questions) that was not used to tune thresholds. Outside check: SciFact (BEIR, 5,183 abstracts, 300 claims). Tested on a laptop with a GTX 1650 (4 GB) and a local 3B model.',
      metric:
        'hit@5 (is the right page in the top 5 results), nDCG@10 on SciFact (0.730, 95% CI 0.689 to 0.769), and refusal of off-topic questions.',
      checks: [
        '95% bootstrap confidence intervals, with a fixed random seed.',
        'A held-out set written after the thresholds were tuned, so it stays held out.',
        'Single-fact answers are scored automatically with regex answer keys (15 of 17 correct on held-out).',
        'A record of what was tried and did not work, kept in DECISIONS.md.'
      ],
      caveat:
        'The test sets are small, so most differences are within noise, and I wrote the held-out questions myself. Answer quality is weaker than retrieval: about 22 to 23 of 27 held-out in-scope answers were correct, graded by an AI session, not a person.'
    },
    links: [{ label: 'Source', href: repo('AdaptiveRAG') }]
  },
  olist: {
    id: 'olist',
    title: 'Olist Revenue Leak Analysis',
    kicker: 'SQL, Python and Power BI on ~100,000 e-commerce orders',
    stack: ['SQL', 'Python', 'Power BI', 'Excel'],
    date: 'Nov 2026',
    problem: 'Where does a Brazilian online marketplace lose money, and what should it fix first?',
    built: [
      'About 100,000 Olist orders (2016–2018) combined with IBGE state data, analysed with SQL (CTEs, window functions) and Python.',
      'A tested data pipeline (raw files, staging, star schema, analysis) with 20 automated data-quality tests that recalculate revenue and the late-delivery rate independently from the raw CSV files.',
      'A 4-page Power BI dashboard (9-table star schema, 16 DAX measures), an Excel workbook, a live web dashboard, a 3-page report and a one-page memo to Operations.',
      'An explainable late-delivery risk model (logistic regression, ROC AUC 0.72) tested on months it never saw.'
    ],
    proved: [
      'Only 3.0% of customers ever buy a second time, and growth has been flat since January 2018.',
      'Late orders score 2.57 stars against 4.29 for on-time orders, but repeat purchase within 90 days is about the same after a late first order (2.03% vs 2.31%, p = 0.15).',
      'Up to R$1.5M (11.5%) more revenue is possible if six high-income states reached Rio de Janeiro’s sales per resident. This is an upper bound, and Paraná is proposed as the first test.'
    ],
    highlights: [
      { n: '100k', l: 'orders analysed (2016–2018)' },
      { n: '3.0%', l: 'of customers buy a second time' },
      { n: 'R$1.5M', l: 'upper-bound regional opportunity' }
    ],
    method: {
      setup:
        'About 100,000 Olist orders from 2016 to 2018 joined with IBGE state population and income data, rebuilt into a star schema in SQLite. Metric definitions were fixed before the analysis started.',
      metric:
        'Repeat-purchase rate (3.0%), average review score for late versus on-time orders (2.57 vs 4.29), a hypothesis test on repeat purchase within 90 days after a late first order (2.03% vs 2.31%, p = 0.15), and ROC AUC 0.72 for the risk model.',
      checks: [
        '20 automated data-quality tests must pass: revenue and the late rate are recalculated from the raw CSV files and must match, with no duplicate or lost rows, and every state matching the IBGE table.',
        'The tests caught two real bugs during the build.',
        'The risk model is validated on months it never saw (time-based validation).'
      ],
      caveat:
        'This is observational data, so there are no causal claims. The R$1.5M is an upper bound, not a forecast: costs, margins and carrier data are not in the dataset, and the money figures are scenarios. The risk model ranks risk but is not precise: it catches 25% of late orders in the riskiest 10% of orders.'
    },
    links: [
      { label: 'Live dashboard', href: 'https://muskanpandey0304.github.io/Olist_Revenue_Leak_Analysis' },
      { label: 'Source', href: repo('Olist_Revenue_Leak_Analysis') }
    ]
  }
};

export const moreBuilds: { title: string; date: string; text: string; href?: string }[] = [
  {
    title: 'AI Model Orchestrator',
    date: 'Aug 2026',
    text: 'A two-stage semantic router that sends each query to 1 of 14 cybersecurity expert domains and then to a task variant, using cosine similarity over BAAI/bge-large-en-v1.5 embeddings with an all-MiniLM-L6-v2 fallback. Ambiguous queries fall back to an LLM router on a confidence margin, and an async inference pipeline (AsyncOpenAI, httpx) adds domain-aware guided prompts and resilient output parsing.'
  },
  {
    title: 'Data Collection & Scraping for Model Training',
    date: 'Jul 2026',
    text: 'Python data pipelines that collect, validate and structure training data from websites, GitHub repositories and research papers across cybersecurity domains. Asynchronous scrapers and crawlers cover Medium, GitHub repositories (25+ languages), Excel-listed web pages and cybersecurity sources such as MITRE ATT&CK, NIST, Exploit-DB, SANS whitepapers and PortSwigger research. They skip duplicates by content hash, retry failed GitHub requests, fall back to a headless browser for JavaScript pages and log failed fetches.',
    href: repo('Data_scraping_forge')
  },
  {
    title: 'Phishing URL Detection',
    date: '',
    text: 'A Flask app that extracts 30 URL, HTML and domain features from a link and classifies it with a Keras deep-learning model. URLs arrive live over a TCP socket from a second machine.',
    href: repo('Main_phishing_url_detection')
  }
];
