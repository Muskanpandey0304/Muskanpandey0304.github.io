# bhoomi.md: Muskan Pandey Portfolio Blueprint (v2: "Coder Girl, Vol. 01")

v2 replaces the first draft. That one was correct but impersonal: it read like any engineer's site. This version keeps the same real content but gives it **Muskan's personality**. The site is built like an **original manga volume** and starred by an **original illustrated "coder girl" character**. It is playful on the surface and rigorous underneath.

> Rule that never bends: **the look is playful, the numbers are real.** Every metric comes from the resumes or the repos. Never invent one.

---

## 0. Make it yours: fill this in first (5 minutes)

The design below uses defaults. Change any line here, and the matching section of the site changes with it. These values live in `src/config/me.ts` (see §9).

| Knob | Default in this spec | Your choice |
|---|---|---|
| Vibe | Manga volume: ink, paper, screentone, speed lines | ☐ keep ☐ softer/cuter ☐ darker/cyber |
| Signature colour | Orange `#FF7A1A` (kept from your current site) | ☐ keep ☐ sakura pink ☐ violet ☐ teal |
| Default theme | Manga paper (light) | ☐ paper ☐ night ink |
| Character avatar | Original manga-style Muskan: hoodie, headphones, laptop | ☐ yes, commission ☐ draw myself ☐ no avatar |
| Default path | ML Engineer | ☐ ML ☐ Data Analyst |
| Tone of copy | Confident + a little playful | ☐ keep ☐ more formal ☐ more fun |
| Hobbies for "Behind the Panels" | *(you supply: e.g. sketching, anime, chai, music)* | ________ |
| Your catchphrase | "I build it, then I prove it." | ________ |
| Sound effects | Off by default, with a toggle | ☐ keep ☐ remove |
| Achievements game | On | ☐ on ☐ off |

---

## 1. What changes from the current repo (and why)

The current site is someone else's Naruto template (`package.json` name `megha-portfolio`) built around official Naruto characters (`itachi.webp`, `Naruto-SageMode.webp`, `public/nj/*`). **Keep the spirit and replace the borrowed parts:**

| Keep ✅ | Replace 🔁 |
|---|---|
| Anime/manga energy, Japanese design accents | Official Naruto characters and art → **an original character of Muskan** |
| Orange signature colour | "Chakra", "ninja", "忍" branding → Muskan's own name, the "MP" seal and chapters |
| Frame-sequence character animation idea | The 270-frame `public/seq` clips → a light layered avatar (CSS/SVG animation, about 150 KB) |
| Fonts: Unbounded, Manrope, JetBrains Mono, Shippori Mincho | (keep these, and add **Dela Gothic One** for sound-effect lettering) |
| Vite, React, GSAP, Lenis, OGL, the GitHub Pages workflow | `CurtainOpen/Close`, `ChakraStrike`, `Bonds` sections |

**Why:** copyrighted characters on a job-hunting page are a risk, and recruiters who know the template will notice it. An original character is *more* memorable and fully yours.

**Data fixes in `src/data.ts`:** remove `stars: 2026`, fill in the email (`mpandey9385@gmail.com`), and change the NTRO text to the resume wording. Also add the missing **Olist** project.

---

## 2. The concept

**The site is Volume 01 of a manga about Muskan.**

- The hero is the **cover**.
- Each project is a **Chapter** with its own "arc" name, laid out in **manga panels**, and contains a **live interactive demo**.
- Big numbers appear as **manga sound-effect lettering** (e.g. `ZOOM! 6.6×`, `BLOCKED!`).
- Skills are a **skill tree** where every node points to a real project.
- Hackathon wins are **boss battles won**.
- Contact is the last page: ***"To be continued… in your team?"***

Visitors pick a route at the start, **"Choose your path: ML Engineer / Data Analyst"**, styled like a game character-select. The path re-orders the chapters and changes the hero text and the resume download. Each resume links to its own path (`?path=ml` or `?path=data`).

Hidden layer: **Achievements**. Running demos and exploring unlocks small trophies (8 total). It's playful, it nudges recruiters to actually *try* the demos, and it remembers progress in the browser.

---

## 3. Visual design system

### 3.1 Colours (`src/styles/tokens.css`)

```css
:root {                      /* MANGA PAPER (default) */
  --paper:   #F6F0E4;        /* warm manga paper */
  --paper-2: #EDE5D4;        /* panel fill */
  --ink:     #141217;        /* ink black: text, panel borders */
  --ink-2:   #4B4650;
  --ink-3:   #847E86;        /* captions */
  --tone:    rgba(20,18,23,.14);  /* screentone dots */

  --brand:   #FF7A1A;        /* Muskan orange: THE accent */
  --brand-2: #FFB347;        /* light orange for glows */
  --pink:    #FF8FB1;        /* sakura: rare highlight (avatar blush, hearts) */
  --win:     #2E9E5B;        /* passed / success */
  --fail:    #E2383F;        /* blocked / late / attack / baseline */
  --sky:     #3E8EDE;        /* second chart series only */

  --border: 3px solid var(--ink);  /* manga panel border */
  --radius: 4px;                   /* manga = sharp corners */
  --gutter: clamp(16px, 4vw, 56px);
  --maxw: 1280px;
}

:root[data-theme="night"] {  /* NIGHT INK */
  --paper:   #0E0C12;
  --paper-2: #17141D;
  --ink:     #F3EEE4;
  --ink-2:   #B9B2BC;
  --ink-3:   #7C7582;
  --tone:    rgba(243,238,228,.10);
  --brand:   #FF8A33;
  --win:     #4CC982;
  --fail:    #FF5A60;
}
```
- The theme toggle is a small ☀/🌙 button. The first visit follows `prefers-color-scheme`.
- Orange covers **at most about 8% of any screen**: the name seal, the active path, the key numbers, buttons, and focus rings.
- Every text and background pair must pass WCAG AA in both themes. Orange text on paper fails at small sizes, so use orange for large text and fills only.

### 3.2 Typography

| Role | Font | Example |
|---|---|---|
| Cover title / chapter titles | **Unbounded** 800 | `MUSKAN PANDEY` |
| Sound-effect lettering | **Dela Gothic One**, skewed −8°, with a thick ink outline (`-webkit-text-stroke` or SVG) | `ZOOM!` `BLOCKED!` `FOUND!` |
| Japanese accents | **Shippori Mincho B1** | `第一章` (Chapter 1), vertical text on the cover |
| Body | **Manrope** 400/600, 17px, line-height 1.65 | paragraphs |
| Labels / data / terminal | **JetBrains Mono** 12.5px, uppercase, 0.06em tracking | `CH.01 · OCT 2026` |

Japanese accents are **decoration with correct meaning only**. Double-check them with a native speaker or a dictionary:
- `第一巻` = Volume 1
- `第一章`…`第四章` = Chapter 1–4
- `ムスカン・パンデー` = Muskan Pandey in katakana
- `つづく` = To be continued

### 3.3 Manga visual language (CSS/SVG, no image files needed)
1. **Panels:** a `3px` ink border, a slight random rotation (−0.6° to 0.6°) on alternating panels, and a 14px gutter on paper. Hover lifts the panel 4px and gives it an offset ink shadow `6px 6px 0 var(--ink)`.
2. **Screentone:** a halftone dot background using `radial-gradient(var(--tone) 1px, transparent 1.5px) 0 0/6px 6px`. Use it in panel corners and behind numbers, faded with `mask-image` gradients.
3. **Speed lines:** a radial SVG of about 60 thin ink wedges centered on a point. It flashes behind big moments (scale 0.9→1.05, opacity 0→1→0, 500ms).
4. **Speech bubbles:** an SVG bubble with a tail for the avatar's lines. Its text types in at 30 chars/sec.
5. **Ink splash:** an SVG mask with `feTurbulence` + `feDisplacementMap` that reveals images and titles like spilled ink.
6. **Paper grain:** an SVG noise overlay at 5% opacity, `pointer-events:none`.
7. **Page-turn transition:** each new chapter enters with a diagonal **panel wipe** (`clip-path: polygon` sweeping from the corner, 600ms). It is not a heavy 3D page curl.

### 3.4 Layout
- A 12-column grid, max width 1280px, 24px gap. Manga pages are **asymmetric panel grids** (CSS Grid `grid-template-areas`), not uniform cards.
- At ≤ 720px, panels stack in a single column with a 16px side gutter. **No horizontal page scroll.**
- Each chapter opens with a **title page**: chapter number in Japanese and English, an arc name, and a one-line logline.

---

## 4. The character (the heart of the personality)

**An original manga-style Muskan.** Get it drawn as a commission (Instagram/Fiverr illustrators, roughly ₹2–6k) or draw it yourself. Brief for the artist:

> Original character. **Must not resemble any existing anime character.** A young Indian woman engineer in clean manga line-art with flat colour, plus an orange accent. She wears an oversized hoodie with a small "MP" patch, headphones around her neck, and holds a laptop with stickers. Expression: confident and friendly. **Deliver layered PNG or SVG** (separate layers for body, head, eyes-open, eyes-closed, mouth variants, hair front, arm) at 2× resolution, transparent background.
> **Poses (5):** ① Cover: waving, laptop under arm ② Thinking: hand on chin (RAG chapter) ③ Typing fast with motion lines (TuringServe) ④ Arms crossed, shield emblem (GuardML) ⑤ Magnifying glass, detective (Olist) ⑥ *(bonus)* Victory peace sign with a trophy (Hackathons).

**Alive, not heavy (CSS/GSAP on layers):**
- Idle loop: a blink every 3–5 s (random), a subtle breathing scale (1→1.008, 3 s), and a hair sway (rotate ±1.5° on the hair layer).
- **Eyes follow the cursor** within a small radius (desktop only).
- Clicking the avatar shows a random speech bubble from `me.ts → quips` (e.g. "Did you try the race demo yet?", "Every number here has a test behind it.", "Chai count today: classified.").
- Reduced motion: a static pose with no idle animation.

**No avatar fallback:** if there's no art yet, show a big **"MP" ink seal** (a hanko-style stamp, SVG) wherever the character would be. The site still works.

---

## 5. Page-by-page spec

Order: **Nav → Cover → Choose Path → Ch.0 Profile → Ch.1–4 → Side Stories → Skill Tree → Battle Record → Behind the Panels → Final Page.**

### NAV (sticky, 64px)
```
[MP seal] Muskan Pandey   Chapters ▾  Skills  Record  Contact   [ ML | Data ]  🏆 3/8  ⌘K  🌙  🔊
```
- Paper background at 85% with a blur. A thick ink bottom border appears after scroll. The nav hides on scroll-down and shows on scroll-up.
- **Chapters ▾** opens a "table of contents" dropdown styled like a manga contents page: chapter numbers in Japanese and the arc names.
- **🏆 3/8** is the achievements counter. Click it for a trophy shelf modal.
- 🔊 is the sound toggle, **off by default**.
- Mobile: seal, path toggle, and a menu button that opens a full-screen "contents page".

### COVER (hero, 100vh)
```
┌─────────────────────────────────────────────────────────────┐
│ 第一巻 VOL.01                              ◉ Open to roles 2026 │
│  ┌───────────────┐                                     ム   │
│  │               │   MUSKAN                            ス   │
│  │  [avatar,     │   PANDEY                            カ   │
│  │   waving]     │                                     ン   │
│  │               │   AI/ML Engineer  ·  Data Analyst        │
│  └───────────────┘   "I build it, then I prove it."         │
│   ░░ screentone ░░                                          │
│   [ Start reading → ]   [ Résumé ↓ ]   GitHub ↗  LinkedIn ↗ │
│ ─────────────── 6.6× faster · 100%→5% attacks · 100k orders ─│
└─────────────────────────────────────────────────────────────┘
```
**Entrance (about 1.8 s total, skippable by scrolling):**
1. 0.0 s: paper background with a screentone fade-in.
2. 0.2 s: the cover frame's ink border **draws itself** (SVG stroke, 600ms).
3. 0.5 s: the avatar is revealed by an **ink-splash mask**.
4. 0.8 s: `MUSKAN` / `PANDEY` letters **stamp in** one by one (scale 1.4→1, slight rotation, 40ms stagger). A **speed-lines** burst plays behind them.
5. 1.2 s: the vertical katakana fades down. The role line types itself. The avatar's speech bubble says *"Hi! Pick a path to start →"*.
6. Bottom ticker: a slow marquee of real headline numbers (reuse `ScrollVelocity`).

**WebGL extra (OGL, optional and lazy-loaded):** about 1,500 tiny ink-dot particles drift behind the cover like a halftone cloud and **scatter away from the cursor**. On path switch they briefly swirl into a ⚙ network shape (ML) or a 📊 bar shape (Data), then drift again. Skip it if time is short, since the cover is complete without it.

### CHOOSE YOUR PATH (small band under the cover)
```
        ─── CHOOSE YOUR PATH ───
 ┌──────────────────────┐   ┌──────────────────────┐
 │  ⚙  ML ENGINEER       │   │  📊  DATA ANALYST     │
 │  LLM systems · RAG ·  │   │  SQL · Python ·       │
 │  agent safety · CUDA  │   │  Power BI · stats     │
 │  [ SELECTED ✓ ]       │   │                       │
 └──────────────────────┘   └──────────────────────┘
```
- Game character-select style. The selected card gets an orange border, a speed-lines burst, and a tiny avatar jump (6px, 300ms). In-game, a `"PATH LOCKED IN!"` SFX label appears.
- This syncs with the nav toggle, the URL `?path=`, and localStorage (see §6).

### CH.0 CHARACTER PROFILE (about)
A **character card**, like the profile page at the start of a manga volume:
```
┌──────────────┬──────────────────────────────────────────────┐
│ [avatar      │ NAME     Muskan Pandey  ムスカン・パンデー      │
│  bust shot]  │ CLASS    AI/ML Engineer · Data Analyst         │
│              │ ORIGIN   Theem College of Engineering (Univ.    │
│              │          of Mumbai) · B.E. CSE (AIML), 2022–26 │
│              │          Honours in Data Science               │
│              │ SPECIAL  Making systems prove themselves        │
│              │ TITLES   🏆 SIH Winner 2024 · 🏆 SIH Winner 2025 │
│              │ GUILD    NTRO, Cybersecurity Intern (3 months)  │
└──────────────┴──────────────────────────────────────────────┘
```
Bio paragraph (ML path): *"I'm a 2026 CSE (AIML) graduate who likes building the hard parts of AI: inference kernels, retrieval pipelines, and safety guards for agents. Then I like proving they work with tests, benchmarks, and confidence intervals."*
Bio paragraph (Data path): *"I'm a 2026 CSE graduate with Honours in Data Science. I take messy data, check that the numbers can be trusted, and turn them into clear, ranked recommendations, in SQL, Python, and Power BI."*

Rows type in one after another (60ms per row) when the card enters view. **No stat bars or "power levels".** The only stats shown are real ones.

### CHAPTERS 1–4 (projects)

Order by path:
- **ML:** Ch.1 TuringServe → Ch.2 GuardML → Ch.3 AdaptiveRAG → Ch.4 Olist
- **Data:** Ch.1 Olist → Ch.2 AdaptiveRAG → Ch.3 GuardML → Ch.4 TuringServe

Each chapter has the same structure:
1. **Title page** (full width): `第一章 · CHAPTER 1`, the arc name in Unbounded, a logline, an avatar pose on the side, and the tech stack as ink stamps. It enters with a panel-wipe transition.
2. **Story panels** (an asymmetric grid with 3 panels): **The Problem**, **What I Built**, **How I Proved It**. Each panel has a small panel-header label in mono.
3. **The Big Panel:** the **live demo**. A large bordered panel with an SFX label and a caption box like a manga narration box: *"Fig. 3: Long-prompt prefill latency on a Tesla T4. Lower is better."*
4. **Links row:** `[ Source code ↗ ]` `[ README ↗ ]` (+ `[ Live dashboard ↗ ]` for Olist).

#### Ch. TuringServe: "The Speed Arc" ⚡
- *Logline:* "Old GPU. New tricks."
- **Problem:** Popular LLM servers focus on new GPUs. Turing cards like the Tesla T4 get slower paths. *(Confirm this framing with the README.)*
- **Built:** An LLM inference server **from scratch** in Python, Triton and CUDA. Paged KV cache, continuous batching, INT8, and speculative decoding.
- **Proved:** 328 tests and a 2-hour zero-error soak test. **6.6× faster long-prompt prefill than vLLM** on a Tesla T4 (1.7 s vs 11.1 s). **38% higher throughput** at 64 concurrent users.
- **DEMO: "The Race"** 🏁
  - Two manga-style race lanes: an avatar-chibi runner labeled **TuringServe** and a grey runner labeled **vLLM**. A `[ ▶ START THE RACE ]` button.
  - Both lanes run **in real time**. TuringServe crosses the line at **1.7 s** with an SFX **"ZOOM!"** and speed lines, plus a stamp `1.7s ✓`. vLLM keeps going… and finishes at **11.1 s** (`11.1s` in grey-red). A big mono timer runs, and a `skip ⏭` link sits under it.
  - Afterwards: an SFX panel **"6.6× FASTER!"** and a smaller panel `+38% throughput @ 64 users`. Only plot a throughput curve if the repo has the real data.
  - 🏆 Achievement: **"Speed Witness"**.

#### Ch. GuardML: "The Guardian Arc" 🛡️
- *Logline:* "An AI agent that can't be talked into trouble."
- **Problem:** LLM agents with tool access can be hijacked by text hidden in what they read (prompt injection).
- **Built:** An LLM agent that diagnoses ML model degradation (MLflow, DVC, Docker). **Safety is enforced in code on every tool call**: validation, provenance and intent checks, human approval, auto-rollback, and an audit log.
- **Proved:** Attack success **100% → 5%** on Muskan's 62-scenario benchmark, and **65% → 0%** on the external AgentDojo benchmark (40-case banking slice).
- **DEMO: "Try to Hack the Agent"** 😈
  ```
  Pick an attack:  [ Friendly request ] [ Hidden injection ] [ Tampered model ] [ Bad arguments ]

  🤖 Agent → [①VALIDATE] → [②PROVENANCE] → [③INTENT] → [④HUMAN OK] → ✅ RUN → 📜 LOG
                   ✓              ✓             ✕
                                             "BLOCKED!" (SFX, red, screen-shake 4px)
  ```
  - **Use 3–4 real scenarios copied from the GuardML benchmark files.** Don't make them up.
  - A glowing token travels along the gates. Each gate stamps ✓ (green) or ✕ (red). The avatar (arms-crossed pose) pops up with *"Nice try 😌"*.
  - A terminal-style **audit log** panel appends a JSON line for each run.
  - Before/after bars: `My benchmark 100% → 5%`, `AgentDojo 65% → 0%`. The "before" bar fills red, then a **"SLASH!"** cut animates it down to the green "after" value.
  - The `aria-live` region announces the result in plain text.
  - 🏆 Achievement: **"Failed Hacker"** (run every attack).

#### Ch. AdaptiveRAG: "The Seeker Arc" 🔎
- *Logline:* "An AI that cites its sources, and admits when it doesn't know."
- **Problem:** RAG systems often answer confidently even when the documents don't contain the answer.
- **Built:** A local, citation-grounded RAG over research papers. Hybrid **BM25 + FAISS**, **RRF fusion**, cross-encoder reranking, and a **confidence gate that refuses off-topic questions**. Runs fully offline on a 4 GB GPU with Ollama.
- **Proved:** Bootstrap CIs on dev and held-out sets, plus PeerQA and SciFact (BEIR). **0.93 held-out hit@5**, **0.73 nDCG@10**.
- **DEMO: "Ask the Library"** 📚
  - 4 question chips: 3 about the indexed papers and 1 off-topic (*"Best pani puri in Mumbai?"*).
  - Clicking a chip plays 4 mini-panels in sequence:
    1. **BM25** and **FAISS** each show a top-5 list (book-spine cards).
    2. **Fusion:** the cards fly together into one ranked list (GSAP Flip) with SFX **"MERGE!"**.
    3. **Rerank:** the cards reshuffle and scores appear.
    4. **Confidence gate** (a dial gauge): on-topic → needle green → answer bubble with citation chips `[1] [3]` and SFX **"FOUND!"**. Off-topic → needle red → the avatar (thinking pose) says *"I don't have evidence for that in these papers. I'd rather not guess."*
  - **Data comes from a real recorded run.** Run AdaptiveRAG locally on the 4 questions and save the outputs to `src/content/rag-demo.json`.
  - 🏆 Achievement: **"Honest Answer"** (trigger the refusal).

#### Ch. Olist: "The Detective Arc" 🕵️
- *Logline:* "100,000 orders. One question: where is the money leaking?"
- Theme it as a **case file**: manila-folder panel tabs, "EVIDENCE" stamps, red string between clues.
- **Built:** About 100,000 Olist orders (2016–2018) analysed with **SQL** (CTEs, window functions) and **Python**. A star schema, and a pipeline with **20 automated quality tests** that re-derive revenue and the late-delivery rate from the raw files. A **4-page Power BI dashboard** (9-table star schema, 16 DAX measures), an Excel workbook, a live web dashboard, an operations memo, and a late-delivery risk model (logistic regression, **ROC AUC 0.72**, validated on unseen months).
- **DEMO: "The Case File"** 🗂️ (4 clue cards. Clicking a card flips it to show the evidence.)
  1. **Clue #1, Loyalty:** a 10×10 dot grid where only 3 dots light orange. *"Only 3 in 100 customers buy twice."*
  2. **Clue #2, Late deliveries:** two rows of stars. On-time ★4.29 vs late ★2.57, with the stars "falling" animation.
  3. **Clue #3, The plot twist:** *"Late delivery hurts reviews… but does it stop people coming back?"* Flip → **p = 0.15: no measurable effect.** SFX **"PLOT TWIST!"**
  4. **Clue #4, The lead:** **R$1.5M** (11.5%) regional revenue opportunity, stamped **"UPPER BOUND · TEST DESIGNED"**.
  - When all 4 clues are open, red string connects them and a **"CASE CLOSED"** stamp lands. 🏆 Achievement: **"Detective"**.
  - Buttons: `[ Open live dashboard ↗ ]` (https://muskanpandey0304.github.io/Olist_Revenue_Leak_Analysis), `[ Source ↗ ]`.
  - Keep the qualifiers "upper-bound" and "designed the test to validate it" visible. Honesty is the flex.

### SIDE STORIES (smaller projects)
Two smaller "bonus chapter" panels:
- **Data Collection & Scraping for Model Training** (Jul 2026): Python pipelines that collect, validate and structure training data from websites, GitHub repos and research papers. They handle URL failures and data gaps across cybersecurity domains. → `Data_scraping_forge`
- **Phishing URL Detection** → `Main_phishing_url_detection`. *(Write the blurb from the repo README. It isn't on the resumes.)*

### SKILL TREE (skills)
A **game-style skill tree** drawn in SVG: nodes connected by ink lines, with branches grouped by area.
```
              ┌── PyTorch ── TensorFlow ── Keras
      ML & AI ┼── scikit-learn ── Transformers ── NLP ── OpenCV
              └── LLM systems ── RAG ── FAISS ── BM25 ── Ollama
                               └── Triton ── CUDA
   ROOT: Python · SQL · C
              ┌── Power BI (DAX) ── Excel ── Tableau
    ANALYTICS ┼── pandas ── NumPy ── Matplotlib
              └── Stats: hypothesis tests ── CIs ── bootstrap ── regression ── experiment design
      MLOps ──── MLflow ── DVC ── Docker ── Git ── Linux ── CI regression checks
```
- The path chosen in "Choose your path" highlights its branch (ML or Analytics) and dims the other to 50%.
- **Hover or tap a node** to see a tooltip: `Used in → GuardML, AdaptiveRAG`. Clicking jumps to that chapter. **Only link a node to a project where it was actually used.**
- Nodes with no project evidence (e.g. Kubernetes, REST APIs) go into a separate small list labeled **"Also trained in"**.
- Entrance: the lines draw from the root outward (stroke-dashoffset), and nodes pop in with a 30ms stagger.

### BATTLE RECORD (hackathons, internship, certifications)
- **Two "boss battle" panels side by side**, the biggest visual moment after the cover:
  - `🏆 SMART INDIA HACKATHON 2024 · WINNER`, PS 1748: an algorithm for coordinated swarm engagement among autonomous drones to neutralize an adversarial drone swarm.
  - `🏆 SMART INDIA HACKATHON 2025 · WINNER`, PS 25164: a framework for static analysis of vulnerabilities in Android applications.
  - Entrance: speed lines plus a big SFX **"VICTORY!"**, with the avatar's victory pose between the two panels. Shown once only.
- **Internship panel:** NTRO, Cybersecurity Intern (3 months). *"Analysed Android APKs using static code and manifest analysis to identify potential security vulnerabilities."*
- **Certification badges** (a small row of ink stamps): AWS Data Engineering (Aug 2025), AWS Cloud Web Application Builder (Apr 2025), AWS Cloud Foundations (Apr 2025), IBM SkillsBuild AI (Oct 2025), IBM AI-Enabled Applications for Customer Service (Oct 2025). Link each one to its credential URL if there is one.
- **Education** lives in Ch.0 Profile, so it isn't repeated here.

### BEHIND THE PANELS (personal, the "customize for me" section)
This is what makes the site *Muskan's* and not a template. Use a 4–6 panel mini-comic, **made from Muskan's own content**:
- Hobbies (from §0), e.g. sketching, music, anime, chai. Use her own photos or doodles in panels with screentone frames.
- "Currently learning:" one line, updated often.
- "Fun fact:" one line.
- "My desk setup" photo (optional).
- **Use only her own photos and art here.** No screenshots of anime.

### FINAL PAGE (contact)
```
          つづく  TO BE CONTINUED…
     …in your team?            [avatar waving]

   ✉  mpandey9385@gmail.com   [ Copy ]
   [ 📄 Résumé: ML Engineer ]  [ 📄 Résumé: Data Analyst ]
   GitHub ↗   LinkedIn ↗
```
- Copying the email gives a toast `"Copied! ✓"` and the avatar gives a thumbs-up bubble. Fall back to `mailto:`.
- The résumé for the current path is the primary (orange) button. The PDFs live in `public/resume/`.
- **No phone number** on the public site.
- Footer, small and in mono: `© 2026 Muskan Pandey · Drawn in code with React, GSAP & SVG · Vol.02 coming soon · Press ⌘K`.

---

## 6. Path system ("Choose your path")

```ts
// src/content/paths.ts
export type Path = 'ml' | 'data';
export const paths = {
  ml:   { label: 'ML Engineer',  role: 'AI/ML Engineer · LLM systems · Evaluation',
          chapters: ['turingserve','guardml','adaptiverag','olist'],
          resume: '/resume/Muskan_Pandey_Resume_AIML.pdf', branch: 'ml' },
  data: { label: 'Data Analyst', role: 'Data Analyst · SQL · Python · Power BI',
          chapters: ['olist','adaptiverag','guardml','turingserve'],
          resume: '/resume/Muskan_Pandey_Resume_Data_Analyst.pdf', branch: 'analytics' },
} as const;
```
- **Initial value:** URL `?path=` → localStorage (wrapped in try/catch) → `me.defaultPath`.
- **On change:** update the URL with `history.replaceState`, save to localStorage, set `<html data-path>`, and update `<title>`. The chapters re-order with **GSAP Flip** (700ms), and the cover role line re-types.
- **Put these links on the resumes:** AIML → `…/?path=ml`, Data Analyst → `…/?path=data`.

---

## 7. Fun layer

### 7.1 Achievements (8, stored in localStorage, never required)
| Trophy | How to unlock |
|---|---|
| 📖 First Page | Start reading (scroll past the cover) |
| 🔀 Path Chooser | Switch paths once |
| ⚡ Speed Witness | Watch the full TuringServe race |
| 😈 Failed Hacker | Try every GuardML attack |
| 🤔 Honest Answer | Trigger the RAG refusal |
| 🕵️ Detective | Open all 4 Olist clues |
| ⌨️ Power User | Open the command palette |
| 🎌 Completionist | Reach the final page with 7/7 → the avatar says *"You read the whole volume! Let's talk?"* and the email button glows |

The toast slides in bottom-right in a manga panel with a trophy icon, stays 2.5 s, and is announced via `aria-live`. The nav counter is clickable and shows the trophy shelf.

### 7.2 Command palette (`Ctrl/⌘ K`)
Commands: `go <chapter>`, `path ml` / `path data`, `race`, `hack`, `ask`, `case`, `resume ml` / `resume data`, `copy email`, `theme night` / `theme paper`, `sound on`, `whoami`, and the easter egg **`sudo hire muskan`**. The easter egg prints `Permission granted ✓`, plays a speed-lines burst, and opens `mailto:`.

### 7.3 Sound (off by default)
There are 4 tiny SFX (each under 15 KB, `.mp3` / `.ogg`, royalty-free or self-recorded): page whoosh, stamp thud, "ding" for achievements, and a soft keyboard click for typing. They play only after the user turns sound on. The setting is remembered.

### 7.4 Cursor (desktop only)
An **ink-dot cursor**: a 10px ink dot plus a fading trail of 6 dots. Over a button it grows into a circle with a label (`open`, `run`, `read`). The real cursor stays visible over text. It is disabled on touch devices and with reduced motion.

---

## 8. Motion rules

| Token | Value | Use |
|---|---|---|
| `ease-pop` | `back.out(1.7)` | stamps, SFX, achievement toasts |
| `ease-out` | `expo.out` | entrances |
| `ease-io` | `power3.inOut` | page wipes, Flip re-order |
| fast / base / slow | 180 / 450 / 900 ms | hover / toggles / entrances |

1. Lenis smooth scroll at `lerp 0.1`, turned off with reduced motion.
2. Entrance animations play **once**. Don't replay them on scroll-back.
3. Pin at most **2 things**: the chapter "story panels" column on desktop, and the Battle Record entrance. No scroll-jacking elsewhere.
4. SFX lettering: scale 0→1.15→1 (`ease-pop`, 400ms), rotation −8°, a speed-lines flash behind it, and a 4px screen shake only on BLOCKED!.
5. **Reduced motion:** final states show instantly. Demos still work, but bars jump to their final values and the race shows the results immediately with an explanation.
6. **No blocking preloader.** Text renders immediately, and the art and WebGL fade in when ready.
7. Pause all loops (avatar idle, WebGL) when they're offscreen or the tab is hidden.

---

## 9. Tech and file structure

**Stack:** Vite 6, React 18, TypeScript, GSAP (ScrollTrigger + **Flip**), Lenis, and OGL (optional particles). Charts are **hand-made SVG** with no chart library. Reuse from the current repo: `CountUp`, `ScrollVelocity` (ticker), `ClickSpark` (recolour it orange, demos only), `Magnet` (email button), `SplitText`.

```
src/
  config/
    me.ts              # ← THE customization file (see below)
  content/
    paths.ts  chapters.ts  skills.ts  record.ts  quips.ts
    rag-demo.json      # recorded real run
    guard-demo.json    # real benchmark scenarios
  styles/
    tokens.css  base.css  manga.css   # panels, screentone, speech bubbles, SFX
  hooks/
    usePath.tsx  useTheme.ts  useAchievements.ts  useSound.ts  useReducedMotion.ts
  components/
    Nav.tsx  PathSelect.tsx  Panel.tsx  SpeechBubble.tsx  Sfx.tsx  SpeedLines.tsx
    InkReveal.tsx  Stamp.tsx  Avatar.tsx  Toast.tsx  CommandPalette.tsx  InkCursor.tsx
  sections/
    Cover.tsx  Profile.tsx  Chapter.tsx  SideStories.tsx  SkillTree.tsx
    BattleRecord.tsx  BehindPanels.tsx  FinalPage.tsx  Footer.tsx
  demos/
    Race.tsx  HackTheAgent.tsx  AskTheLibrary.tsx  CaseFile.tsx
  webgl/ InkParticles.ts   (optional)
public/
  avatar/   (layered PNG/SVG: cover, think, type, guard, detective, victory)
  resume/   (both PDFs)
  sfx/      (4 sounds)
  me/       (personal photos for Behind the Panels)
  og-image.png  favicon.svg
```

**`src/config/me.ts` is the one file to edit for customization:**
```ts
export const me = {
  name: 'Muskan Pandey',
  nameJa: 'ムスカン・パンデー',
  catchphrase: 'I build it, then I prove it.',
  email: 'mpandey9385@gmail.com',
  github: 'https://github.com/Muskanpandey0304',
  linkedin: 'https://www.linkedin.com/in/muskan-pandey-84a90733b',
  location: 'Maharashtra, India',          // confirm
  defaultPath: 'ml' as 'ml' | 'data',
  defaultTheme: 'paper' as 'paper' | 'night',
  brand: '#FF7A1A',                         // swap to recolour the whole site
  avatar: true,                             // false → "MP" seal fallback
  sound: true,                              // false hides the toggle entirely
  achievements: true,
  hobbies: [/* { title, img, caption } */],
  currentlyLearning: '',
  funFact: '',
  quips: [
    'Did you try the race demo yet?',
    'Every number here has a test behind it.',
    'Pick a path, any path.',
  ],
};
```

---

## 10. Quality bar

- **Performance:** Lighthouse mobile ≥ 90 on Performance and ≥ 95 on the others. LCP < 2.2 s (the LCP element is the HTML title text). Initial JS ≤ 200 KB gzipped. Lazy-load the demos, WebGL and avatar poses below the cover. Avatar layers as WebP/AVIF, ≤ 300 KB total for the cover. Preload only 2 font files.
- **Accessibility:** everything works by keyboard (the path select is a `radiogroup`, and the demos use real `<button>`s). Focus ring: `3px solid var(--brand)` + 3px offset. SFX text is `aria-hidden`, and the real result goes to `aria-live`. Each chart has a text alternative. Never convey meaning by colour alone: use ✓/✕ icons and text. Full reduced-motion support.
- **Responsive:** test at 360, 390, 768, 1024, 1440 and 1920 widths. Panels stack on mobile. The race lanes and skill tree scale down (on mobile the tree becomes grouped vertical lists).
- **SEO / share:** title `Muskan Pandey · AI/ML Engineer & Data Analyst`. Meta description: "Read my portfolio like a manga: LLM inference, RAG, agent safety and data analytics, with live demos and real benchmarks." OG image (1200×630): the cover with the avatar and the name. JSON-LD `Person` with `sameAs` GitHub and LinkedIn. `favicon.svg` = the orange "MP" seal.
- **Honesty:** the numbers and qualifiers match the resumes ("upper-bound", "my 62-scenario benchmark", "40-case banking slice", "held-out"). Demo data is recorded from real runs or copied from benchmark files.

---

## 11. Build order

**Phase 1: Clean and set up (day 1)**
- [ ] Rename the package. Remove the Naruto art, sections and frame sequences. Add the tokens, `manga.css` and fonts.
- [ ] Create `me.ts` and `src/content/*` with all the text from this file.
- [ ] Commission the avatar now, because it takes 1–2 weeks. Use the "MP" seal fallback until it arrives.

**Phase 2: Readable manga (days 2–3)**
- [ ] Nav, Cover (static), Path select, Profile, 4 chapters with static figures, Side stories, Skill tree (static), Battle record, Behind the panels, Final page.
- [ ] Path system with URL and storage. Theme toggle. Resumes in place. **Deploy, because this version is already shippable.**

**Phase 3: Manga motion (days 4–5)**
- [ ] Cover entrance sequence, ink reveals, stamps, speed lines, SFX component, page-wipe chapter transitions, Flip re-ordering, skill tree draw.

**Phase 4: Demos (days 6–8)**
- [ ] Race → Case File → Hack the Agent → Ask the Library (record the real RAG run first).

**Phase 5: Fun layer (day 9)**
- [ ] Achievements, command palette, ink cursor, sound, avatar idle and eye-tracking, speech bubbles (once the art arrives).

**Phase 6: QA (day 10)**
- [ ] Lighthouse, keyboard-only pass, reduced-motion pass, iOS Safari and Android Chrome.
- [ ] Number audit against both PDFs. Japanese text checked. Update the resumes with the `?path=` links.

---

## 12. Don'ts
- ❌ Official anime characters, screenshots or logos anywhere (including Behind the Panels).
- ❌ "Power level" or skill-percentage bars, fake stats, or fake testimonials.
- ❌ Sound on by default, or a blocking intro over 2 s.
- ❌ Demo data that wasn't actually produced by the real projects.
- ❌ More than 2 pinned sections, or animations that replay every scroll.
- ❌ Phone number on the public page.

## 13. Questions for Muskan
1. Answers to the §0 "Make it yours" table.
2. Avatar: commission it, draw it, or go with the seal-only fallback?
3. Hobbies, photos and a fun fact for Behind the Panels.
4. NTRO dates, and the public location line.
5. Custom domain or `muskanpandey0304.github.io`?
