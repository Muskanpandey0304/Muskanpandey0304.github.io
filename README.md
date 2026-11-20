# Muskan Pandey: portfolio

A single-page portfolio for an AI/ML engineer and data analyst. Dark "lab instrument" look, one lime accent, and demos that run in the page.

- **Lens switch (ML Engineer / Data Analyst):** reorders the numbers, projects and skills, and changes the hero terminal and the default résumé. Link straight to a view with `?lens=ml` or `?lens=data`.
- **Case studies:** TuringServe, GuardML, AdaptiveRAG, Olist. Each has a demo and a "How I measured it" panel with an honest caveat.
- **Extras:** Ctrl+K command palette, dark and light themes, respects reduced motion, works on phones.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
npm run preview    # serves the built site
```

Pushing to `main` builds the site and publishes `dist/` to the `gh-pages` branch (`.github/workflows/deploy.yml`).

## Where things live

| To change… | Edit |
|---|---|
| Name, email, links, status | `src/content/profile.ts` |
| Project text, numbers, "how I measured it" | `src/content/projects.ts` |
| Receipts tiles and the results ticker | `src/content/proof.ts` |
| Hero text and the order shown in each lens | `src/content/lens.ts` |
| Commands shown in the hero terminal | `src/content/terminal.ts` |
| GuardML scenarios and AdaptiveRAG routes | `src/content/demos.ts` |
| Skills (each linked to a project) | `src/content/skills.ts` |
| Timeline, certifications, principles | `src/content/record.ts` |
| Résumé PDFs | `public/resume/` |
| Colours, fonts, spacing | `src/styles/tokens.css` |

## Keep the numbers true

Every project number is copied from the project's own repo. Before changing one, check it in the repo, and re-run the check in [FACT_CHECK.md](FACT_CHECK.md) after any repo changes. `resume-originals/` keeps the untouched résumé PDFs. `bhoomi.md` is the original design blueprint.

## Project repos

- GuardML: https://github.com/Muskanpandey0304/GuardML
- AdaptiveRAG: https://github.com/Muskanpandey0304/AdaptiveRAG
- TuringServe: https://github.com/Muskanpandey0304/TuringServe
- Olist Revenue Leak Analysis: https://github.com/Muskanpandey0304/Olist_Revenue_Leak_Analysis
