# bhoomi.md: Portfolio Blueprint for Muskan Pandey (v3: Lab Notebook + "Engineer at Work")

This is the complete build spec for Muskan Pandey's portfolio: the concept, content, UI design, hero illustration, motion, interactive demos, tech stack, file structure, and build order. Follow it from top to bottom. Every number on the site must come from the two resumes or the project repos. **Never invent a metric.**

> **Version note:** v3 is the chosen direction: a professional **Lab Notebook** theme, with an **original illustration of Muskan working at her laptop** in the hero and a **live terminal on the laptop screen**. No anime or manga styling. The earlier manga draft is kept in `bhoomi-v2-manga.md` for reference only. **Don't build from it.**

---

## 0. The one-paragraph pitch

Muskan has two resumes, **AI/ML Engineer** and **Data Analyst**, and one habit that runs through both: **every claim is measured**. Examples are the 20 data-quality tests, the 328 tests plus a 2-hour soak test, bootstrap CIs, the 62-scenario attack benchmark, p = 0.15, and ROC AUC on unseen months. So the portfolio's theme is:

> **Signal / Noise: "I build AI and data systems, and then I prove they work."**

The site looks like a **modern research lab notebook crossed with a live instrument panel**. It uses figure captions, section numbers (§01, §02…), monospace readouts, and charts that animate.

The hero gives it a human, engineer feel. It shows **an original illustration of Muskan at her laptop**, and the laptop screen is a **real, live terminal** that types out her actual results.

The headline feature is a **Lens switch** in the nav: `ML Engineer ⇄ Data Analyst`. It re-orders the projects, re-writes the hero line, changes what the laptop terminal shows, and re-weights the skills. One site covers both resumes, and each resume links to its own lens.

**Why Lab Notebook instead of a full terminal theme:** data-analyst recruiters need readable charts and dashboards, and all-monospace sites are tiring to read and very common. The terminal lives **inside the laptop in the hero** (and in the Ctrl+K palette). That delivers the engineer vibe without hurting readability.

---

## 1. Before you start: problems with the current repo

The current `coder-girl-main` is a fork of someone else's template (`package.json` name is `megha-portfolio`). It is Naruto-themed and uses anime character art (`shots/itachi.webp`, `Naruto-SageMode.webp`, `public/nj/*`, the `忍` logo, the kanji labels, and the "chakra" and "bonds" sections).

**Replace all of that.** Reasons:
1. **Copyright.** Those are copyrighted characters and art. A public portfolio shouldn't depend on them.
2. **Recognition.** Recruiters who have seen the original template will notice. An original site is the whole point of a portfolio.
3. **Signal.** For ML and data roles, the design should show *engineering taste and rigour*.
4. **Weight.** About 270 frame-sequence images in `public/seq/` make the loading curtain heavy.

**Don't reuse `public/img/codergirl.webp`, `laptop-white.webp`, `laptop-orange.webp` or `companion.webp`.** They are the original author's personal avatar: the art literally says "codergirl.megha", and the laptop shows a Dell logo. Showing them on Muskan's site would mean presenting someone else's identity as hers. Replace them with the custom illustration in §4.

**Data bugs to fix in `src/data.ts`:**
- `stats.stars: 2026` is wrong. Delete the stats block.
- `email: ''` is empty. Use `mpandey9385@gmail.com`.
- The NTRO internship text doesn't match the resume. The resume says: *"Analysed Android APKs using static code and manifest analysis to identify potential security vulnerabilities."* Use the resume wording. The Android static-analysis *framework* belongs to the **SIH 2024** win (PS 25164).
- The Olist project (the most important Data Analyst project) is missing completely.
- The project screenshots point at anime images.

**Keep:** Vite, React 18, TypeScript, GSAP + ScrollTrigger, Lenis, OGL, and the GitHub Pages workflow (`.github/workflows/deploy.yml`).

**Delete:** `src/bits/*` that you don't reuse, `src/naruto.css`, `public/nj`, `public/seq`, `public/img/*`, the sections `CurtainOpen`, `CurtainClose`, `ChakraStrike` and `Bonds`, and the `motion` dependency if it ends up unused.

---

## 2. Audience and what they must get in 10 seconds

| Visitor | Arrives from | Must see within 10 s |
|---|---|---|
| ML / AI recruiter | AIML resume link `?lens=ml` | "AI/ML Engineer", TuringServe 6.6× number, GuardML 100%→5%, GitHub link |
| Data analyst recruiter | Data resume link `?lens=data` | "Data Analyst", Olist: 100k orders, SQL + Power BI, live dashboard link |
| Hiring engineer (technical) | Either | Real demos, repo links, honest methodology, "how I measured it" |
| Anyone on a phone | LinkedIn | Fast load, readable, no broken animation |

**Primary actions (in this order):** View a project → Open the GitHub repo or live dashboard → Download the resume → Email.

---

## 3. Visual design system

### 3.1 Mood
A **dark lab instrument** look: near-black graphite, warm off-white "paper" text, and one phosphor-green "signal" accent used sparingly, like the trace on an oscilloscope. A warm red-orange marks only "noise / failure / attack" states. There should be lots of negative space, thin 1px rules, small monospace annotations, and figure captions. The **illustration of Muskan** adds warmth and personality, and the lime glow from her laptop screen ties her into the palette.

It should feel like **an engineer's notebook made beautiful**. It should not look like a generic gradient SaaS page.

### 3.2 Color tokens (put these in `src/styles/tokens.css`)

```css
:root {
  /* dark is default */
  --bg:        #0B0C0E;   /* graphite black */
  --bg-2:      #121418;   /* raised panels */
  --bg-3:      #1A1D23;   /* hover / inputs */
  --ink:       #ECE8E1;   /* paper white text */
  --ink-2:     #A7A49D;   /* secondary text */
  --ink-3:     #6B6A66;   /* captions, axis labels */
  --line:      rgba(236, 232, 225, 0.10);
  --line-2:    rgba(236, 232, 225, 0.18);

  --signal:    #C8F560;   /* phosphor lime: THE accent */
  --signal-dim:#C8F56022;
  --noise:     #FF6A3D;   /* failures, attacks, "before" values */
  --info:      #7CC4FF;   /* secondary series in charts only */

  --term-bg:   #0E1A12;   /* laptop terminal screen */
  --term-ink:  #C8F560;

  --radius-s: 6px;
  --radius-m: 12px;
  --radius-l: 20px;
  --gutter: clamp(16px, 4vw, 56px);
  --maxw: 1240px;
}

:root[data-theme="light"] {
  --bg:   #F4F1EA;  /* lab paper */
  --bg-2: #ECE8DF;
  --bg-3: #E2DDD2;
  --ink:  #141414;
  --ink-2:#4A4844;
  --ink-3:#7D7A73;
  --line: rgba(20,20,20,0.10);
  --line-2: rgba(20,20,20,0.20);
  --signal: #4E7A00;   /* darker lime for contrast on paper */
  --signal-dim:#4E7A0018;
  --noise: #C2410C;
  --info:  #1D6FB8;
  /* terminal stays dark in both themes: it's a screen */
}
```

Rules:
- `--signal` covers **at most about 5% of any screen**. Use it for the key number, the active lens, focus rings, the terminal text, and the chart "after" series.
- `--noise` appears only for "before / attack / late / baseline" values.
- Every text and background pair must pass WCAG AA (4.5:1 for body text). Check light mode separately.

### 3.3 Typography (Google Fonts, self-host the subsets later)

| Role | Font | Use |
|---|---|---|
| Display | **Instrument Serif** (italic + regular) | Hero name, section titles, big pull-numbers |
| UI / body | **Geist** (400 / 500 / 600) | Paragraphs, nav, buttons |
| Mono | **Geist Mono** (400 / 500) | Captions, labels, metrics, terminal, section numbers |

Type scale (fluid):
```css
--fs-hero:  clamp(56px, 10vw, 152px);  /* name */
--fs-h2:    clamp(36px, 6vw, 80px);
--fs-h3:    clamp(22px, 2.4vw, 30px);
--fs-big-n: clamp(48px, 8vw, 120px);   /* metric numbers */
--fs-body:  17px;  line-height 1.6
--fs-small: 14px;
--fs-mono:  12.5px; letter-spacing 0.04em; uppercase for labels
--fs-term:  clamp(10px, 1.05vw, 14px); /* text on the laptop screen */
```
Pairing trick: put a **serif italic word inside a sans headline**. Example: "I build systems, *then I prove* they work."

### 3.4 Layout grid
- A 12-column grid with max width 1240px, `--gutter` side padding, and a 24px column gap.
- At ≤ 720px, use a single column with a 16px side gutter and **no horizontal scroll ever**.
- Each section starts with a mono label row: `§03 ─────────── SELECTED WORK ─────────── 04 ITEMS`.

### 3.5 Signature details
1. **Plot-readout cursor (desktop only):** a small crosshair with a mono label that follows the pointer and shows `x 0.42  y 0.77`. Over links it becomes `→ open`, over demos `▶ run`. Hide it on touch devices and with `prefers-reduced-motion`. It never replaces the text cursor over text.
2. **Figure captions:** every chart or image has `Fig. 4 — Long-prompt prefill latency, Tesla T4 (lower is better)` underneath in mono `--ink-3`.
3. **Hairline grid backdrop:** a very faint 48px graph-paper grid behind the hero and the demos (`--line` at 40% opacity), fading out with a radial mask.
4. **Film grain:** a subtle SVG noise overlay at 3–4% opacity, applied with `pointer-events:none`.
5. **Section numbers in mono:** §01–§08. Run a "scan line" through each number when the section enters.
6. **Status dot in the nav:** a pulsing lime dot with `Open to roles · 2026 grad`.
7. **Margin notes:** in the hero, small hand-drawn-style annotations with thin arrows point at the illustration, like a lab sketch, e.g. `← benchmarking on a T4` and `fig. 0: engineer at work`. Draw them in SVG with stroke-draw animation and the mono font.

---

## 4. Hero illustration: "Engineer at Work" (custom art brief)

This is the personality of the site. It must be an **original illustration of Muskan herself**. Never use a stock character, the old template avatar, or anything that resembles an existing anime or cartoon character.

### 4.1 How to get it
- **Best option:** commission an illustrator (Behance, Dribbble or Fiverr; search for "flat portrait illustration" or "line-art avatar"). Give them 2–3 clear photos of Muskan plus this brief. It usually takes a few days.
- **Alternative:** generate a draft with an AI image tool **from Muskan's own photo**, then have it cleaned up and redrawn so the style is consistent. Make sure the tool's licence allows commercial and portfolio use.
- Get **written confirmation** that Muskan owns the rights to use it on the site and on LinkedIn.

### 4.2 Style brief (send this to the illustrator)
> An original portrait illustration of **Muskan Pandey** (based on the reference photos), a young Indian woman engineer, **seated at a desk working on an open laptop**, seen from a slight 3/4 front angle. Modern **flat illustration with clean ink line-art**. It must look **professional and grown-up, not anime or chibi**: natural proportions, natural eye size. Use a warm neutral palette (graphite, off-white, muted denim and skin tones), with **one lime-green accent** (`#C8F560`) coming only from the glow of the laptop screen onto her face and hands. Outfit: smart-casual (e.g. an overshirt or sweater). Optional details: a coffee or chai mug, a small notebook with a pen, headphones around the neck. Expression: focused but approachable, slight smile. **No brand logos** on the laptop or anywhere else. **Leave the laptop screen completely blank** (a flat dark rectangle): the website puts a live terminal there.

### 4.3 Deliverables
| # | File | Pose / content | Used in |
|---|---|---|---|
| 1 | `hero-at-laptop` | Seated, typing on the open laptop, screen facing the viewer at about 30° | Hero |
| 2 | `hero-at-laptop-layers` | Same art, split into layers: background desk, body, head, **hands**, laptop body, **screen area (blank, separate)** | Hero motion (parallax + typing hands) |
| 3 | `wave` | Turned toward the viewer, waving, laptop half-closed beside her | Contact section |
| 4 | `thinking` *(optional)* | Chin on hand, looking at the screen | 404 page / empty states |

Technical specs:
- Master files: **SVG** (preferred) or **PNG at 2× (about 1600px tall)**, transparent background, plus the editable source (AI, Figma or PSD).
- Web exports: WebP/AVIF, **≤ 150 KB each**. If the art is SVG, optimise it with SVGO to ≤ 120 KB.
- **Screen corner coordinates** (top-left, top-right, bottom-right, bottom-left, in px on the master) noted in a text file, so the live terminal can be placed exactly on the screen with a CSS `matrix3d` transform.
- Provide both a **dark-background** and a **light-background** version if the line colour needs to change between themes. Otherwise use one version with a soft drop shadow.

### 4.4 The live laptop terminal (the hero's wow)
The blank laptop screen is covered by a real HTML element, `<LaptopTerminal />`. It is positioned with the 4 screen-corner coordinates, using a CSS `matrix3d` (perspective) transform so the text sits *on* the tilted screen. It is mono, `--term-ink` on `--term-bg`, with a faint scanline and a soft lime glow (`box-shadow: 0 0 60px var(--signal-dim)`). The glow spills onto the illustration through a radial gradient layer.

It types commands and their real results, in a loop, using content from `src/content/terminal.ts`:

**ML lens script**
```
$ pytest -q
328 passed in 41.2s ✓            ← use the real duration from the repo, or omit it
$ python bench.py --gpu T4 --vs vllm
prefill (long prompt)   1.7s  vs  11.1s
→ 6.6× faster ✓
$ guardml eval --suite injection
attack success   100% → 5%   (62 scenarios) ✓
```

**Data lens script**
```
sql> SELECT ROUND(100.0*AVG(orders>=2),1) AS repeat_pct FROM customers;
repeat_pct
3.0
sql> -- late vs on-time review score
on_time 4.29 ★   late 2.57 ★   repeat effect p = 0.15
$ pytest tests/quality -q
20 passed ✓
```
*(The SQL is a simplified illustration. Before shipping, swap in a real query from the Olist repo or a faithful shortened version.)*

Behaviour:
- Typing speed is about 28 ms per character for commands. Output lines appear instantly, 120 ms apart. Pause 2.5 s at the end, then clear and loop.
- **Switching the lens** finishes the current line fast, clears with a quick `clear`, then starts the other script.
- **Hover or click the screen** to pause, and the cursor shows `▶ explore` → clicking scrolls to the matching project demo.
- In sync with the typing, the **hand layer** of the illustration moves slightly up and down (2px, alternating, `steps(2)`). It stops when the typing stops.
- **Parallax:** on mouse move (desktop), the layers shift by different amounts. The background desk moves ±4px, the body ±8px and the laptop ±12px. Use GSAP `quickTo` with a 0.6 s ease. It's subtle, not a fun-house effect.
- **Reduced motion:** show the final state of the script statically (all lines visible), with no typing, no hand motion and no parallax.
- Accessibility: the terminal is `aria-hidden="true"` (decorative). The same facts are in the visible Proof strip below. The illustration gets `alt="Illustration of Muskan Pandey working on her laptop"`.

---

## 5. Information architecture (page order)

Single page, long scroll. Every section has an `id` for anchors and the command palette.

```
NAV  (logo · sections · Lens switch · ⌘K · theme toggle)
§01  HERO              #top        (name + illustration with live laptop terminal)
§02  PROOF STRIP       #proof      (6 headline numbers)
§03  SELECTED WORK     #work       (4 deep case studies with live demos)
§04  MORE BUILDS       #more       (smaller projects)
§05  TOOLKIT           #skills     (evidence-linked skills)
§06  TRACK RECORD      #record     (education, NTRO, 2× SIH, certifications)
§07  HOW I WORK        #principles (3 principles)
§08  CONTACT           #contact    (waving illustration, email, resumes, socials)
FOOTER
```

---

## 6. Section-by-section spec (content + UI + motion)

### NAV (sticky)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ◉ MP   Work  Skills  Record  Contact     [ ML Engineer | Data Analyst ]  ⌘K  ☾ │
└──────────────────────────────────────────────────────────────────────────┘
```
- Height 64px, background `--bg` at 70% with `backdrop-filter: blur(12px)` and a bottom hairline that appears after 24px of scroll.
- It hides on scroll-down and reappears on scroll-up (translateY, 300ms).
- **Lens switch:** a segmented control with a lime pill that slides between the options (GSAP, 450ms, `expo.out`). See §7.
- `⌘K` opens the command palette (§8). Show `Ctrl K` on Windows.
- Mobile: logo + lens switch (shortened to `ML | Data`) + a menu button that opens a full-screen sheet with big serif links.

### §01 HERO

Desktop layout (12 columns): text on the left (cols 1–6), illustration on the right (cols 7–12), on the faint graph-paper grid.

```
 ┌────────────────────────────────────────────────────────────────────┐
 │ ● Open to roles · B.E. CSE (AIML), Honours in Data Science · 2026  │
 │                                                                    │
 │  Muskan                            ╭── fig. 0: engineer at work    │
 │  Pandey          (serif, huge)     │   ┌────────────────────────┐  │
 │                                    │   │   [illustration of     │  │
 │  AI/ML Engineer  ← lens-driven     │   │    Muskan at desk]     │  │
 │  I build AI and data systems,      │   │   ┌──────────────┐     │  │
 │  and then I *prove* they work.     │   │   │$ python bench│ ← live terminal
 │                                    │   │   │6.6× faster ✓ │     │  │
 │  [ View work ↓ ]  [ Résumé ↓ ]     │   │   └──────────────┘     │  │
 │  GitHub ↗   LinkedIn ↗             │   └────────────────────────┘  │
 │                                    ← benchmarking on a T4 (margin note)
 │  ↓ scroll                                                          │
 └────────────────────────────────────────────────────────────────────┘
```
- **Mobile:** the illustration goes on top (about 70% width, centred), then the name, role line and CTAs. The terminal still runs, using the smaller `--fs-term`.
- Height: `min-height: 100svh`, with content vertically centred.

**Hero copy by lens**

| | ML lens | Data lens |
|---|---|---|
| Role line | `AI/ML Engineer · LLM systems · Evaluation` | `Data Analyst · SQL · Python · Power BI` |
| Sub-line | "I build LLM systems, from inference kernels to RAG to agent safety, and benchmark every one of them." | "I turn messy data into numbers you can trust and ranked recommendations you can act on." |
| Primary CTA | View work | View the Olist analysis |
| Laptop terminal | ML script (§4.4) | Data script (§4.4) |

**Entrance sequence (about 1.8 s total, plays once):**
1. 0.0 s: the graph-paper grid fades in (400 ms).
2. 0.1 s: the illustration fades up 24px with a slight blur-to-sharp (700 ms, `expo.out`).
3. 0.3 s: the name reveals letter by letter, sliding up from a 110% y-offset with a 0.03 s stagger.
4. 0.8 s: the laptop screen "powers on". A brightness flicker (2 frames), then the lime glow grows and the terminal starts typing.
5. 1.0 s: the role line, sub-line and CTAs fade up with a 0.08 s stagger.
6. 1.4 s: the margin-note arrows draw in (SVG stroke-dashoffset, 600 ms).

**Optional background layer (phase 4, only if performance allows):** a faint **"Noise → Signal" particle field** (OGL) behind the hero. About 1,200 dim points start as random noise and slowly settle into a soft scatter-plot cloud, and the cursor gently pushes them away. Keep it **behind** the illustration and at low contrast. **The illustration is the star, not the particles.** Skip it on mobile and with reduced motion.

**On scroll out:** the illustration moves up slower than the text (parallax 0.85×), and the laptop terminal dims to 40%.

### §02 PROOF STRIP: "Receipts"

A horizontal band of **6 numbers**. Each one counts up when it enters the viewport and has a one-line caption and a link to the evidence.

| Number | Caption | Links to | Lens priority |
|---|---|---|---|
| **6.6×** | faster long-prompt prefill than vLLM on a Tesla T4 (1.7 s vs 11.1 s) | TuringServe | ML 1 |
| **100% → 5%** | prompt-injection success with GuardML guards on (62 scenarios) | GuardML | ML 2 |
| **0.93** | held-out hit@5 on research-paper retrieval | AdaptiveRAG | ML 3 |
| **100k** | e-commerce orders analysed with SQL + Python | Olist | Data 1 |
| **20** | automated data-quality tests that re-derive revenue from raw files | Olist | Data 2 |
| **2×** | Smart India Hackathon winner (2024, 2025) | Record | both |

- Layout: a 3×2 grid on desktop. On mobile, a horizontal snap-scroll row of cards with peek.
- The lens re-orders the cards with a FLIP animation (GSAP Flip plugin, 600ms).
- "100% → 5%": the 100% is shown in `--noise` with a strike line drawn through it, then the 5% counts in, in `--signal`.
- Each card says `→ see the proof` on hover. Clicking it scrolls to that project's demo and briefly pulses its border.

### §03 SELECTED WORK: case studies with live figures

This is the heart of the site. There are **4 case studies**, ordered by lens:
- **ML lens:** TuringServe → GuardML → AdaptiveRAG → Olist
- **Data lens:** Olist → AdaptiveRAG → GuardML → TuringServe

Each case study is a full-width panel with the same structure:

```
┌ 01 / TURINGSERVE ───────────────────────── Python · Triton · CUDA ┐
│                                                                    │
│  LLM inference server for Turing GPUs        ┌──────────────────┐ │
│  (serif title)                               │  INTERACTIVE     │ │
│                                              │  FIGURE          │ │
│  PROBLEM   one sentence                      │                  │ │
│  BUILT     2–3 bullets                       │                  │ │
│  PROVED    the measurement + method          └──────────────────┘ │
│                                              Fig. 3 — caption     │
│  [ Source ↗ ]  [ Read the README ↗ ]                               │
└────────────────────────────────────────────────────────────────────┘
```
- Desktop: text on the left (5 columns) and the figure on the right (7 columns). As you scroll through a case study, the left text column is **sticky** while the figure plays.
- Mobile: title → figure → text → links.
- Panel entrance: a hairline border draws around the panel (stroke-dashoffset, 900ms), then the content fades up.

#### Case 1: TuringServe (LLM inference server)
- **Problem:** "Modern LLM servers target new GPUs. Older Turing cards (like the T4 most people can actually rent) get left behind."
  *(Confirm this framing with Muskan or the repo README.)*
- **Built:** Inference server from scratch in Python, Triton and CUDA. Paged KV cache, continuous batching, INT8, and speculative decoding.
- **Proved:** 328 tests and a 2-hour zero-error soak test. Triton tensor-core attention kernels give **6.6× faster long-prompt prefill than vLLM** on a Tesla T4 (1.7 s vs 11.1 s) and **38% higher throughput at 64 concurrent users**.
- **Figure: "The Prefill Race"**
  - Two horizontal lanes labeled `TuringServe` and `vLLM`, with a `▶ Run race (real time)` button.
  - Clicking it fills both bars **in real seconds**. TuringServe (`--signal`) finishes at 1.7 s and shows `✓ 1.7 s`. vLLM (`--noise`) keeps crawling until 11.1 s. A mono timer counts up. Add a `skip ⏭` link.
  - Under it: a small "Throughput @ 64 concurrent users" stat: `+38%`. If the repo has a benchmark CSV covering several concurrency levels, plot the real series. **Don't draw a curve from a single point.**
  - Caption: `Fig. 3 — Long-prompt prefill latency, Tesla T4. Lower is better.`

#### Case 2: GuardML (secure LLM agent and tool safety)
- **Problem:** "An LLM agent with tool access can be talked into doing damage by text it reads (prompt injection)."
- **Built:** An agent that diagnoses ML model degradation (MLflow, DVC, Docker). Safety is enforced **in code on every tool call**: validation, provenance and intent checks, human approval, auto-rollback, and an audit log.
- **Proved:** Attack success fell from **100% to 5%** on Muskan's 62-scenario benchmark, and from **65% to 0%** on the external AgentDojo benchmark (40-case banking slice).
- **Figure: "Attack Simulator"**
  ```
  Scenario: [ Benign request ▾ ]                         [ ▶ Send ]

  Agent proposes → ①Validate → ②Provenance → ③Intent → ④Approval → Execute → Audit log
                     ●───────────●────────────✕
                                              BLOCKED: intent mismatch
  ```
  - A dropdown offers **3–4 scenarios taken from the real GuardML benchmark**. Copy their real text from the repo and **don't invent them**. Aim for: one benign request (passes all gates, executes, logs), one prompt injection hidden in tool output (blocked at Intent), one tampered artifact (blocked at Provenance), and one malformed or dangerous argument (blocked at Validate).
  - A token (a small lime dot) travels along the pipeline. Each gate lights up green ✓ or turns `--noise` ✕ with a short shake (4px, 3 cycles). An `aria-live` region states the outcome in text.
  - A terminal-style **audit log** panel underneath appends a JSON line for each run (timestamp, tool, decision, gate).
  - Beside it, two small bar pairs: `Own benchmark 100% → 5%` and `AgentDojo (banking, 40) 65% → 0%`.
  - Caption: `Fig. 4 — Prompt-injection attack success rate, without vs with guards. Lower is better.`

#### Case 3: AdaptiveRAG (query-routed RAG)
- **Problem:** "RAG systems answer confidently even when the answer isn't in the documents."
- **Built:** Local, citation-grounded RAG over research papers. Hybrid BM25 + FAISS search, RRF fusion, cross-encoder reranking, and a **confidence gate that refuses off-topic questions**. Runs fully offline on a 4 GB GPU with Ollama.
- **Proved:** Bootstrap CIs on dev and held-out sets, plus PeerQA and SciFact (BEIR): **0.93 held-out hit@5, 0.73 nDCG@10**.
- **Figure: "Watch a Query Route"**
  - 4 preset query chips: 3 on-topic questions about the indexed papers and 1 off-topic (for example *"What's a good pizza place in Mumbai?"*).
  - Clicking a chip animates the pipeline in 4 columns:
    1. **BM25** top-5 list and **FAISS** top-5 list appear side by side.
    2. They **merge into the RRF list**: items fly into their fused rank (GSAP Flip).
    3. **Rerank:** the list re-orders and scores appear.
    4. **Gate:** for on-topic queries, the answer appears with citation chips `[1] [3]`. For the off-topic query, the gate needle drops below the threshold and a calm refusal appears: *"I don't have enough evidence in these papers to answer that."*
  - **Data:** produce `src/content/rag-demo.json` by actually running AdaptiveRAG locally on the 4 queries and saving the real intermediate lists, scores and answers.
  - Small metric tiles: `hit@5 0.93 (held-out)` and `nDCG@10 0.73`. Show the CI as an error bar if the repo has the bounds.
  - Caption: `Fig. 5 — Retrieval pipeline for a single query (recorded run).`

#### Case 4: Olist Revenue Leak Analysis (SQL, Python and Power BI)
- **Problem:** "Where is a Brazilian e-commerce marketplace losing revenue, and which leaks are worth fixing?"
- **Built:** Analysis of about 100,000 Olist orders (2016–2018) with SQL (CTEs, window functions) and Python. A star schema and a pipeline with **20 automated quality tests** that re-derive revenue and the late-delivery rate from the raw files. A 4-page Power BI dashboard (9-table star schema, 16 DAX measures), an Excel workbook, a live web dashboard, an operations memo, and an explainable late-delivery risk model (logistic regression, **ROC AUC 0.72**, validated on unseen months).
- **Proved / found:**
  - Only **3.0%** of customers buy twice.
  - Late delivery cuts reviews from **4.29 → 2.57 stars**, *without* measurably reducing repeat purchases (**p = 0.15**).
  - An upper-bound **R$1.5M (11.5%)** regional revenue opportunity, plus the test designed to validate it.
- **Figure: "Mini Dashboard"** (a 2×2 tile grid that looks like a BI panel)
  1. **Waffle 10×10:** 100 dots, 3 lit in `--signal`. Label: "3 in 100 customers come back."
  2. **Stars comparison:** two rows of 5 stars. On-time 4.29 is filled in `--signal`, late 2.57 is filled in `--noise`. The fill animates on view.
  3. **The honest twist:** a card that reads "Late delivery hurts ratings… but does it hurt repeat buying? **p = 0.15**: no measurable effect."
  4. **Opportunity:** `R$1.5M` count-up with the label "upper bound · 11.5% · test designed to validate".
  - Buttons: `Open live dashboard ↗` (https://muskanpandey0304.github.io/Olist_Revenue_Leak_Analysis), `Source ↗`, `Read the memo ↗` (if it's public in the repo).
  - Caption: `Fig. 6 — Olist, ~100k orders, 2016–2018.`

### §04 MORE BUILDS

| Project | One-liner | Links |
|---|---|---|
| Data Collection & Scraping for Model Training (Jul 2026) | Python pipelines that collect, validate and structure training data from websites, GitHub repos and papers. Handles URL failures and data gaps across cybersecurity domains. | `Data_scraping_forge` repo |
| Phishing URL Detection | ML classifier for phishing URLs. *(Write the blurb from the repo README. It isn't on either resume.)* | `Main_phishing_url_detection` repo |

Row hover: the background goes to `--bg-3`, an arrow slides 6px right, and a small real screenshot fades in by the cursor (desktop only).

### §05 TOOLKIT: evidence-linked skills

**Don't use skill percentage bars.** Group the skills, and make every skill chip **point to the project where it was used**.

- **Languages:** Python, SQL (joins, CTEs, window functions), C
- **ML & AI:** PyTorch, TensorFlow, Keras, scikit-learn, Transformers, OpenCV, NLP
- **LLM systems:** RAG, embeddings, FAISS, BM25, Ollama, Triton, CUDA, agents and tool safety, prompt-injection evaluation
- **Analytics & BI:** Power BI (data model, DAX), Tableau, Excel, pandas, NumPy, Matplotlib
- **Statistics:** hypothesis testing, confidence intervals, bootstrap, cohort analysis, regression, experiment design, data-quality testing
- **MLOps & systems:** MLflow, DVC, Docker, Git, GitHub, Linux, CI regression checks

(The ML lens shows them in this order. The Data lens puts Analytics and Statistics first.)

Interaction: hovering or focusing a chip highlights the matching projects (`used in → GuardML · AdaptiveRAG`), and other chips dim to 40%. Click scrolls to that project. Mapping data lives in `src/content/skills.ts` as `{ name, group, usedIn: [...] }`. **Only map a skill to a project if the resume or repo shows it was used there.** Unmapped skills (for example Kubernetes or Tableau) go in a quieter "Also familiar with" line.

### §06 TRACK RECORD

A vertical timeline with a lime progress line that draws as you scroll (ScrollTrigger scrub on `scaleY`).

| When | Item | Detail |
|---|---|---|
| 2022 – 2026 | **B.E. Computer Science & Engineering (AIML)**, Theem College of Engineering, University of Mumbai | Honours in Data Science |
| Dec 2024 | 🏆 **Winner, Smart India Hackathon 2024** | PS 25164: framework for static analysis of vulnerabilities in Android applications |
| Feb – Jun 2025 (after SIH 2024, before SIH 2025) | **Cybersecurity Intern, NTRO** | Analysed Android APKs using static code and manifest analysis to identify potential security vulnerabilities |
| Dec 2025 | 🏆 **Winner, Smart India Hackathon 2025** | PS 1748: efficient algorithm for coordinated swarm engagement among autonomous drones to neutralize an adversarial drone swarm |
| 2025 | **Certifications** | AWS Data Engineering (Aug), AWS Cloud Web Application Builder (Apr), AWS Cloud Foundations (Apr), IBM SkillsBuild Artificial Intelligence (Oct), IBM AI-Enabled Applications for Customer Service (Oct) |

- The **two SIH wins** get a large card with a "2×" serif numeral and both problem statements side by side. A thin lime ring draws around the "2×" once. No confetti.
- Certifications show as small pills with dates, linked to credential URLs if available.

### §07 HOW I WORK (3 principles)

1. ***Measure before claiming.*** "Every number on this page has a test, benchmark or confidence interval behind it." *Seen in:* 328 tests · bootstrap CIs · 20 data-quality tests.
2. ***Know when to say "I don't know."*** "A system that refuses off-topic questions or blocks a suspicious tool call is worth more than one that's confidently wrong." *Seen in:* AdaptiveRAG confidence gate · GuardML guards.
3. ***Turn numbers into decisions.*** "Analysis is only finished when it becomes a ranked recommendation someone can act on." *Seen in:* Olist ops memo · R$1.5M opportunity sizing.

Motion: the cards are stacked. On desktop, while the section is pinned, they fan out one by one as you scroll. On mobile they are simply stacked with a fade-up.

### §08 CONTACT

```
 ┌──────────────────────────────────────────────────────────────┐
 │                                        ┌──────────────────┐  │
 │  Let's build something                 │ [illustration:   │  │
 │  you can *measure.*     (serif, huge)  │  Muskan waving]  │  │
 │                                        └──────────────────┘  │
 │  mpandey9385@gmail.com   [ Copy ]   → toast "Copied ✓"       │
 │  [ Résumé: ML Engineer ↓ ]  [ Résumé: Data Analyst ↓ ]       │
 │  GitHub ↗   LinkedIn ↗                                       │
 │  Based in Maharashtra, India · open to on-site / remote      │
 └──────────────────────────────────────────────────────────────┘
```
- The **waving illustration** (deliverable #3) slides in from the right when the section enters. The wave plays once (rotate the hand layer ±12°, 3 cycles) and replays on hover.
- The email is a magnetic button (moves up to 8px toward the cursor). The copy button uses `navigator.clipboard`, with a `mailto:` fallback.
- Both PDFs go in `public/resume/`. The button for the current lens is primary.
- **Don't put the phone number on the public site.**

### FOOTER
Mono, small: `© 2026 Muskan Pandey · Built with React, GSAP & WebGL · Illustration by <artist name, linked> · Source ↗ · Last updated Nov 2026`. Also include a tiny "Press ⌘K" hint.

---

## 7. The Lens system (core feature)

**State:** `lens: 'ml' | 'data'`.

**Initial value, in this priority order:**
1. URL `?lens=data` or `?lens=ml`
2. `localStorage['lens']`, wrapped in try/catch
3. Default `'ml'`

**On change:**
- Update the URL with `history.replaceState`.
- Save to localStorage.
- Set `document.documentElement.dataset.lens`.
- Animate everything below.

| Thing | ML lens | Data lens |
|---|---|---|
| Hero role and sub-line | ML copy | Data copy |
| **Laptop terminal script** | **benchmarks, tests, GuardML eval** | **SQL query, Olist results, quality tests** |
| Proof strip order | 6.6×, 100→5%, 0.93, 100k, 20, 2× | 100k, 20, 0.93, 100→5%, 6.6×, 2× |
| Case study order | TS, GML, RAG, Olist | Olist, RAG, GML, TS |
| Skills group order | Languages, ML, LLM… | Languages, Analytics, Stats… |
| Primary résumé button | AIML PDF | Data Analyst PDF |
| `<title>` | Muskan Pandey · AI/ML Engineer | Muskan Pandey · Data Analyst |

**Transitions:** use GSAP Flip for re-ordering lists (600ms, `power3.inOut`). For text, cross-fade with a 6px blur (300ms out, 300ms in).

**Put the portfolio URL on the resumes:**
- AIML resume header: `muskanpandey0304.github.io/?lens=ml`
- Data resume header: `muskanpandey0304.github.io/?lens=data`

```ts
// src/content/lens.ts
export type Lens = 'ml' | 'data';
export const lensCopy = {
  ml:   { role: 'AI/ML Engineer', sub: '...', order: ['turingserve','guardml','adaptiverag','olist'] },
  data: { role: 'Data Analyst',   sub: '...', order: ['olist','adaptiverag','guardml','turingserve'] },
} as const;
```

---

## 8. Command palette (the hidden terminal)

Press `Ctrl/⌘ + K` or `/` to open it. It's styled like the laptop terminal: a centered panel, 560px wide, dark `--term-bg`, mono font, a fuzzy list, arrow keys and Enter to select, and Esc to close. Focus is trapped while it's open.

| Command | Action |
|---|---|
| `go work` / `go skills` / … | scroll to section |
| `lens ml` / `lens data` | switch lens |
| `run race` | scroll to TuringServe and start the race |
| `attack` | scroll to GuardML and run the injection scenario |
| `ask rag` | scroll to AdaptiveRAG and run the off-topic query |
| `resume ml` / `resume data` | download PDF |
| `copy email` | copy email |
| `theme light` / `theme dark` | toggle theme |
| `whoami` | prints a 3-line bio in typewriter style |
| `sudo hire muskan` | easter egg: prints `Permission granted. Opening email…` and opens `mailto:` |

---

## 9. Motion system

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` (expo.out) | entrances |
| `--ease-io` | `cubic-bezier(.65,0,.35,1)` | morphs, Flip |
| `--d-fast` | 180ms | hovers, buttons |
| `--d-base` | 450ms | toggles, cards |
| `--d-slow` | 900ms | section entrances, line draws |

Rules:
1. **Lenis smooth scroll:** use `lerp 0.1`. Disable it with reduced motion.
2. Section entrance: y 32px → 0 and opacity 0 → 1, with a 60ms stagger on children. **Play once only.**
3. Pin only 2 things: the sticky case-study text and the "How I work" fan.
4. Numbers count up over 1.2s with `expo.out` (reuse `bits/CountUp.tsx`).
5. Every animation has a reduced-motion path via `gsap.matchMedia()`.
6. **No preloader** longer than 600ms. Content first.
7. Buttons: on hover, a lime underline grows from the left. On press, `scale(0.97)`.
8. Illustration motion stays **subtle**: typing hands, a small parallax, a single wave. Never bouncing or looping in a distracting way.

---

## 10. Tech stack and file structure

**Stack:** Vite 6, React 18 and TypeScript (already installed), plus `gsap` (ScrollTrigger + Flip), `lenis`, and `ogl` (only for the optional particle layer). There is no chart library: **hand-built SVG charts animated with GSAP**.

```
src/
  main.tsx
  App.tsx
  styles/
    tokens.css  base.css  components.css
  content/            # ALL text and numbers live here, never inside JSX
    profile.ts  lens.ts  projects.ts  proof.ts  skills.ts  record.ts
    terminal.ts       # laptop terminal scripts per lens (§4.4)
    rag-demo.json     # recorded AdaptiveRAG run (real)
    guard-demo.json   # 3–4 real GuardML benchmark scenarios
  hooks/
    useLens.tsx  useReducedMotion.ts  useTheme.ts  useTypewriter.ts
  components/
    Nav.tsx  LensSwitch.tsx  CommandPalette.tsx  Cursor.tsx
    SectionHeader.tsx  Figure.tsx  MetricCard.tsx  CountUp.tsx
    Magnetic.tsx  Toast.tsx  MarginNote.tsx
  hero/
    Hero.tsx
    HeroIllustration.tsx   # layered art + parallax + typing hands
    LaptopTerminal.tsx     # matrix3d-mapped live terminal on the screen
    screenQuad.ts          # the 4 screen-corner coordinates from the artist
  sections/
    Proof.tsx  Work.tsx  More.tsx  Skills.tsx
    Record.tsx  Principles.tsx  Contact.tsx  Footer.tsx
  figures/
    PrefillRace.tsx  AttackSimulator.tsx  RagRouter.tsx  OlistDashboard.tsx
  webgl/                   # optional, phase 4
    ParticleField.ts  shaders.ts
public/
  illustration/
    hero-bg.webp  hero-body.webp  hero-hands.webp  hero-laptop.webp
    wave.webp  thinking.webp
  resume/ (2 PDFs)
  og/og-image.png  (1200×630, uses the hero illustration)
  shots/ (real project screenshots)
  favicon.svg
```

**Mapping the terminal onto the screen (`LaptopTerminal.tsx`):** take the 4 corner points from `screenQuad.ts` (scaled to the rendered image size with a `ResizeObserver`). Compute the homography from a plain rectangle (`0,0 → w,h`) to those 4 points and apply it as `transform: matrix3d(...)` with `transform-origin: 0 0`. This is a standard approach, about 40 lines of maths, so look up "CSS matrix3d from four points". **Fallback:** if the screen is nearly front-facing in the art, just absolutely position the terminal with a small `rotate`/`skew`.

---

## 11. Quality bar (non-negotiable)

**Performance**
- Lighthouse score ≥ 95 on all 4 categories (mobile).
- LCP < 2.0s (the LCP element is the hero name or the illustration: preload the illustration with `fetchpriority="high"`). CLS < 0.05: set explicit width, height and aspect-ratio on the illustration.
- Initial JS ≤ 180 KB gzipped. Lazy-load the figures and the optional WebGL.
- Total weight of all illustrations ≤ 400 KB.
- Pause the terminal loop and any WebGL when the hero is offscreen or the tab is hidden.

**Accessibility**
- Everything works by keyboard: the lens switch is a `role="radiogroup"`, and the demos have real `<button>`s.
- Visible focus ring: `2px solid var(--signal)` with a 3px offset.
- Every chart has a text alternative. Demo results go to `aria-live="polite"`.
- Meaning is never encoded by color alone.
- Full reduced-motion support.

**Responsiveness:** test at 360, 390, 768, 1024, 1440 and 1920. No horizontal scroll anywhere. The terminal text must stay legible at 360px. If it doesn't, show 3 lines instead of 6.

**SEO / sharing**
- `<title>Muskan Pandey · AI/ML Engineer & Data Analyst</title>`
- Meta description: "AI/ML engineer and data analyst. LLM inference, RAG, agent safety, and SQL/Power BI analytics, all measured and benchmarked."
- OG image (1200×630): the hero illustration on the right, serif name on the left, and lime "6.6× · 100%→5% · 100k orders".
- JSON-LD `Person` schema with `sameAs` set to the GitHub and LinkedIn URLs.
- `favicon.svg`: lime "MP" monogram on graphite.

**Honesty**
- Every metric matches the resume in meaning. Keep qualifiers like "upper-bound", "on my 62-scenario benchmark", "40-case banking slice" and "held-out".
- Demo data and terminal output are **from real runs or real files**. Label anything illustrative as illustrative.

---

## 12. Build order (phases)

**Phase 0: Commission the illustration (start right away, runs in parallel)**
- [ ] Send the §4.2 brief, the reference photos and the §4.3 deliverables to an illustrator.
- [ ] Until the art arrives, use a **placeholder**: a simple grey SVG silhouette of a person at a laptop with a blank screen rectangle. Build everything against it.

**Phase 1: Clean slate and skeleton (day 1)**
- [ ] Rename the package to `muskan-portfolio`. Delete the Naruto assets, the old avatar images and the old sections (§1).
- [ ] Add the tokens, base CSS and fonts. Build Nav, SectionHeader and the empty sections with ids.
- [ ] Move all content into `src/content/*`.
- [ ] Add the theme toggle.

**Phase 2: Content complete (days 2–3)**
- [ ] Hero with the placeholder illustration + `LaptopTerminal` typing both lens scripts.
- [ ] Proof strip, 4 case studies with static figures, More builds, Toolkit, Record, Principles, Contact, Footer.
- [ ] Lens switch with re-ordering, plus URL and localStorage sync.
- [ ] Resumes in `public/resume/`. Deploy. **At this point the site is already shippable.**

**Phase 3: Wow layer (days 4–6)**
- [ ] Hero entrance sequence, typing hands, parallax and margin notes.
- [ ] Figures: PrefillRace → AttackSimulator → OlistDashboard → RagRouter.
- [ ] GSAP Flip for the lens. Count-ups. Timeline draw. Principles fan.

**Phase 4: Delight and polish (day 7)**
- [ ] Swap in the final illustration and set `screenQuad.ts` from the artist's coordinates.
- [ ] Waving illustration in Contact. Command palette + `sudo hire muskan`.
- [ ] Plot-readout cursor, grain, grid backdrop, magnetic email, copy toast.
- [ ] *(Optional)* faint particle layer behind the hero.
- [ ] OG image, JSON-LD, favicon.

**Phase 5: QA (day 8)**
- [ ] Lighthouse mobile ≥ 95 ×4. Keyboard-only run. Screen reader spot check (NVDA).
- [ ] Reduced-motion run. Test at the 6 viewport widths. Test Safari iOS + Chrome Android.
- [ ] Number audit: every figure and every terminal line checked against the resumes and repos.
- [ ] Update both resume PDFs with the lens-specific portfolio URL.

---

## 13. Don'ts

- ❌ Anime or manga styling, or copyrighted or fan-art characters.
- ❌ Reusing another person's avatar (the old `public/img/*`).
- ❌ Brand logos on the laptop in the illustration.
- ❌ Skill % bars or star ratings.
- ❌ Long intro animations, autoplay sound, or a custom cursor that hides the real one on text.
- ❌ Made-up testimonials, GitHub stats or "years of experience".
- ❌ Charts or terminal output made from imagined data.
- ❌ Pinning more than two sections.
- ❌ A phone number on the public page.

---

## 14. Open questions to confirm with Muskan

1. Which lens is the default if no `?lens` is given? (This spec assumes ML.)
2. Reference photos for the illustrator, and outfit preferences (overshirt, sweater, kurta-style top?). Should the illustration include a chai mug, headphones or a notebook?
3. Budget and timeline for the illustrator, or should the AI-draft-then-cleanup route be used?
4. NTRO internship dates and exact title.
5. Public location line ("Maharashtra, India"?) and remote/relocation preference.
6. Is the Olist operations memo public? Is the Phishing URL project worth featuring?
7. Real screenshots for each project, and real test durations for the terminal script.
8. Should it be a custom domain (e.g. `muskanpandey.dev`) or `muskanpandey0304.github.io`? For the root URL, the repo must be named `Muskanpandey0304.github.io`.
