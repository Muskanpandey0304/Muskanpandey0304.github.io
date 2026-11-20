import type { ReactElement } from 'react';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { caseStudies } from '../content/projects';
import type { ProjectId } from '../content/lens';
import { useLens } from '../hooks/useLens';

import AttackSimulator from '../figures/AttackSimulator';
import OlistDashboard from '../figures/OlistDashboard';
import PrefillRace from '../figures/PrefillRace';
import RagRouter from '../figures/RagRouter';

// Wrap numbers in the "Proved" bullets so the evidence is scannable.
const NUM = /(R\$[\d.]+M|(?<![@\w])\d+(?:[.,]\d+)?(?:%|×| s(?![a-z])|k(?![a-z]))?)/g;
function Nums({ text }: { text: string }) {
  return (
    <>
      {text.split(NUM).map((part, i) => (i % 2 ? <b key={i} className="num">{part}</b> : part))}
    </>
  );
}

const figures: Record<ProjectId, () => ReactElement> = {
  turingserve: () => <PrefillRace />,
  guardml: () => <AttackSimulator />,
  adaptiverag: () => <RagRouter />,
  olist: () => <OlistDashboard />
};

export default function Work() {
  const { copy } = useLens();

  return (
    <section id="work" className="section wrap">
      <SectionHeader num="03" title="Selected work" meta="4 case studies" />
      <div className="cases">
        {copy.projectOrder.map((id, i) => {
          const c = caseStudies[id];
          return (
            <Reveal as="article" key={id} id={id} className="case">
              <div className="case__text">
                <p className="mono case__idx">
                  {String(i + 1).padStart(2, '0')} / {c.title.toUpperCase()} · {c.date}
                </p>
                <h3>{c.kicker}</h3>
                <p className="case__stack mono">{c.stack.join(' · ')}</p>
                <ul className="case__hl">
                  {c.highlights.map((h) => (
                    <li key={h.n}>
                      <b>{h.n}</b>
                      <span className="mono">{h.l}</span>
                    </li>
                  ))}
                </ul>

                <dl>
                  <dt className="mono">Problem</dt>
                  <dd>{c.problem}</dd>
                  <dt className="mono">Built</dt>
                  <dd>
                    <ul>{c.built.map((b) => <li key={b}>{b}</li>)}</ul>
                  </dd>
                  <dt className="mono">Proved</dt>
                  <dd>
                    <ul>{c.proved.map((b) => <li key={b}><Nums text={b} /></li>)}</ul>
                  </dd>
                </dl>

                <details className="method">
                  <summary>
                    <span className="mono">How I measured it</span>
                    <i aria-hidden="true" />
                  </summary>
                  <dl className="method__body">
                    <dt className="mono">Setup</dt>
                    <dd>{c.method.setup}</dd>
                    <dt className="mono">Metric</dt>
                    <dd>{c.method.metric}</dd>
                    <dt className="mono">Checks</dt>
                    <dd>
                      <ul>{c.method.checks.map((x) => <li key={x}>{x}</li>)}</ul>
                    </dd>
                    <dt className="mono">Honest caveat</dt>
                    <dd className="method__caveat">{c.method.caveat}</dd>
                  </dl>
                </details>

                <div className="case__links">
                  {c.links.map((l) => (
                    <a key={l.href} className="btn" href={l.href} target="_blank" rel="noreferrer">
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div className="case__fig">{figures[id]()}</div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
