# Fact check: portfolio claims vs the GitHub repos

Checked on 2026-11-20 against the public repos under github.com/Muskanpandey0304 (READMEs, `docs/lab_notes.md`, `benchmarks/*/results.md`, `reports/*`, `requirements.txt` and the source trees).
Rule used: a claim stays on the site only if the repo (or the résumé, for non-code facts) states it. Where the résumé was looser than the repo, the site now uses the repo's wording and qualifiers.

Status: ✅ matches the repo · 🔧 was wrong or missing a qualifier, now fixed · ℹ️ not on GitHub (résumé only)

## TuringServe

| Claim on the site | Where the repo says it | Status |
|---|---|---|
| Built from scratch for Turing GPUs; Python, Triton, CUDA; OpenAI-compatible API | README intro | ✅ |
| Paged KV cache, continuous batching, chunked prefill, prefix caching, CUDA graphs, INT8 weights, speculative decoding | README intro and "How it works" | ✅ |
| Triton tensor-core attention kernels; torch 2.6.0 / Triton 3.2.0 pinned | README "Why Turing needs its own engine" | ✅ |
| 6.6× faster cold prefill than vLLM, 1.7 s vs 11.1 s | README headline table: 8,000-token prompt, 1.68 s vs 11.07 s (= 6.59×), Qwen2.5-1.5B fp16, prefix caching off, vLLM 0.33.0, one Kaggle T4 | ✅ (context added) |
| +38% throughput at 64 concurrent users | README table: ShareGPT output tok/s, 64 clients, 1,805 vs 1,308 (= +38.0%) | ✅ (context added) |
| 328 tests | Not written as a number anywhere. `docs/lab_notes.md`: 115 CPU/unit/e2e tests + 213 GPU-marked (189 pass, 24 skipped by design) = 328 | ✅ derived. Site now says "304 pass, 24 skipped by design". Tip: add `328 tests collected` to the README so it is visible |
| 2-hour zero-error soak | README: 40,188 requests, zero errors, memory 1,687 to 1,689 MB | ✅ |
| "Problem" sentence | My earlier wording ("modern servers are tuned for newer GPUs…") was a paraphrase, not from the repo | 🔧 replaced with the README's explanation (no tensor-core instructions below compute capability 8.0, so vLLM attention runs on FMA units) |
| Honest limits | README: INT8 6 to 11% slower decoding, 0.5B draft slower than none, Autopilot no measurable benefit, one GPU, one model | 🔧 added to the caveat |

## GuardML

| Claim on the site | Where the repo says it | Status |
|---|---|---|
| Diagnostic agent for ML degradation using MLflow, DVC, Docker | README "What it is" | ✅ |
| Safety in code on every tool call: validation, provenance, intent check, human approval, auto-rollback, audit log | README "Highlights" and "How it works" | ✅ |
| Attack success 100% → 5% on a 62-scenario benchmark | README "Results": GuardBench, 62 scenarios = 18 legitimate + 44 attacks; 100% (44/44) → 5% (2/44) with ToolGuard + provenance, no human, offline worst case (model assumed already fooled); all benign tasks completed | ✅ number, 🔧 qualifiers added. "62 attack scenarios" was wrong: 44 are attacks |
| 5% holds with a human approver | README: with a rubber-stamp human it is 36% (16/44) | 🔧 added to the caveat and shown under the figure |
| AgentDojo 65% → 0% (40-case banking slice) | README + `benchmarks/agentdojo/results/banking-8x5-qwen2.5-14b.md`: 26/40 → 0/40, qwen2.5:14b, provenance + intent judge | ✅ |
| Cost of the guard on AgentDojo | Same file: utility (no attack) 62% → 38%, i.e. tasks completed 5/8 → 3/8 | 🔧 added (was missing) |
| 659 tests, CI with a benchmark regression gate | README | ✅ (now shown) |
| Demo scenarios and the 8-step guard pipeline | README "How it works", "Demo scenarios", threat model T1 to T3, risk-score table | 🔧 the old demo used invented scenarios; replaced with the README's real ones |

## AdaptiveRAG

| Claim on the site | Where the repo says it | Status |
|---|---|---|
| From scratch, runs locally with Ollama, tested on a GTX 1650 (4 GB) | README intro and "Setup used" | ✅ |
| Router + hybrid BM25/vector + RRF + cross-encoder rerank + confidence gate | README "How it works" and architecture diagram | ✅ |
| 0.93 held-out hit@5 | README: 0.88 dev, 0.93 held-out, 49 + 27 questions, 95% bootstrap CIs | ✅ |
| 0.73 nDCG@10 | `benchmarks/scifact/results.md`: hybrid + rerank 0.730 [0.689, 0.769], 5,183 abstracts, 300 claims, no tuning | 🔧 it is a **SciFact** score, not a held-out score. The ticker said "held-out" and is fixed |
| Evaluated on PeerQA | `benchmarks/peerqa/`: real, but results are weak (gate refused 62% of answerable questions, Rouge-L 0.09) | 🔧 now stated in the caveat |
| Refuses off-topic questions | README: 12/12 held-out, 4/6 dev; 20/22 unanswerable on-topic refused | ✅ (12/12 shown, 4/6 and 20/22 are in the repo; the site's caveat says it is not perfect) |
| Answer quality | README: about 22 to 23 of 27 held-out in-scope correct after the rebuild, AI-graded; small sets, many differences within noise | 🔧 added to the caveat |
| Demo with chunk lists and citations | Not recorded from a real run | 🔧 replaced by a schematic of the real routing logic; no invented chunk ids |

## Olist Revenue Leak Analysis

| Claim on the site | Where the repo says it | Status |
|---|---|---|
| ~100,000 orders, 2016 to 2018, SQL (CTEs, window functions) + Python | README | ✅ |
| 3.0% of customers buy twice | README | ✅ |
| Reviews 4.29 → 2.57 stars when late | README and `reports/insights_report.md` (4.29 = on-time orders) | ✅ |
| Repeat purchase not measurably affected, p = 0.15 | README: 2.03% vs 2.31%, p = 0.148, **within 90 days** | ✅ (90-day qualifier added) |
| R$1.5M (11.5%) upper bound; test designed | README: six high-income states reaching Rio de Janeiro's sales per resident; Paraná proposed as the first test; `reports/experiment_design.md` | ✅ |
| 20 automated data-quality tests re-deriving revenue and late rate from raw files | README "How it is built" | ✅ |
| Power BI: 4 pages, 9 tables, 16 DAX measures; Excel workbook; live dashboard; operations memo | README | ✅ |
| Logistic regression, ROC AUC 0.72, unseen months | README (also "catches 25% of late orders in the riskiest 10%", now in the caveat) | ✅ |
| "late delivery lowers reviews" (my caveat wording) | Data is observational; README says no causal claims | 🔧 reworded |

## More builds

| Claim | Where the repo says it | Status |
|---|---|---|
| Scrapers for Medium, GitHub repos (25+ languages), Excel-listed pages, MITRE ATT&CK, NIST, Exploit-DB, SANS, PortSwigger | `Data_scraping_forge` README | ✅ |
| Dedup by content hash, retry, headless-browser fallback, failure log | Source files: content-hash skip (`workbook_resource_scraper.py`), GitHub retries=4, Playwright fallback, `FAILURES_FILE` (`scrape_threat_intel.py`) | ✅ (retries stated as "GitHub requests"). The résumé phrase "handled URL failures and data gaps" is supported by this code, but the README itself does not say it |
| Phishing detector: 30 features, Keras model, TCP socket | `Main_phishing_url_detection` README | ✅ |

## Résumé-only facts (not on GitHub, not checked here)

Smart India Hackathon 2024 (problem statement 1748) and 2025 (problem statement 25164), the AI Model Orchestrator project (Aug 2026), the NTRO internship (3 months), education, and the certifications.

## What to review on your side

1. **Résumé wording.** Two résumé lines are shorter than the evidence: "100% to 5%" (offline worst case, 36% with a rubber-stamp human) and "0.73 nDCG@10" (it is the SciFact score). They are not wrong, but a careful reader may ask.
2. **PeerQA.** The résumé says AdaptiveRAG was evaluated on PeerQA. It was, but the result is weak. The site now says so. If you would rather not show that, remove the last sentence of the AdaptiveRAG caveat in `src/content/projects.ts`.
3. **"328 tests".** Correct, but only derivable from `docs/lab_notes.md`. Add the number to the TuringServe README.
4. **Repeat this check** whenever a repo changes, because the site copies numbers by hand.
