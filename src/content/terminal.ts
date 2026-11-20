import type { Lens } from './lens';

export type TermLine = { kind: 'cmd' | 'out' | 'ok'; text: string };

// Commands are real ones from the repos' READMEs (TuringServe, GuardML, Olist). Lines starting with "#"
// summarise the measured results documented in those READMEs; they are not literal program output.
export const terminalScripts: Record<Lens, TermLine[]> = {
  ml: [
    { kind: 'cmd', text: 'pytest -m gpu -q' },
    { kind: 'ok', text: '189 passed, 24 skipped (Tesla T4)' },
    { kind: 'cmd', text: 'python -m benchmarks.make_report' },
    { kind: 'out', text: '# 8,000-token prefill: 1.68 s vs vLLM 11.07 s' },
    { kind: 'ok', text: '# → 6.6× faster ✓' },
    { kind: 'cmd', text: 'python -m guardml.bench.run' },
    { kind: 'ok', text: '# attack success 100% → 5% (offline)' }
  ],
  data: [
    { kind: 'cmd', text: 'python pipeline/run_pipeline.py' },
    { kind: 'ok', text: '# 20 data-quality tests must pass' },
    { kind: 'cmd', text: 'python notebooks/04_late_delivery_tests.py' },
    { kind: 'out', text: '# reviews: 4.29 → 2.57 stars when late' },
    { kind: 'ok', text: '# repeat within 90 days: 2.03% vs 2.31%, p = 0.15' }
  ]
};
