import { useEffect, useState } from 'react';
import Figure from '../components/Figure';
import { ragRoutes } from '../content/demos';
import { useReducedMotion } from '../hooks/useMotion';

export default function RagRouter() {
  const reduced = useReducedMotion();
  const [rid, setRid] = useState<string | null>(null);
  const [shown, setShown] = useState(0); // number of steps revealed
  const route = ragRoutes.find((r) => r.id === rid) ?? null;

  const pick = (id: string) => {
    setRid(id);
    setShown(0);
  };

  // Reveal the route one step at a time.
  useEffect(() => {
    if (!route || shown > route.steps.length) return;
    const t = window.setTimeout(() => setShown((s) => s + 1), reduced ? 0 : 520);
    return () => window.clearTimeout(t);
  }, [route, shown, reduced]);

  const done = route && shown > route.steps.length;

  return (
    <Figure n={5} caption="How AdaptiveRAG’s router sends a query through the pipeline (from the project’s architecture diagram).">
      <div className="rag">
        <div className="rag__chips" role="group" aria-label="Choose a kind of query">
          {ragRoutes.map((r) => (
            <button key={r.id} className={`chip ${r.id === rid ? 'is-on' : ''}`} onClick={() => pick(r.id)}>
              {r.label}
            </button>
          ))}
        </div>

        <div className="rag__flow" aria-live="polite">
          {route ? (
            <>
              <p className="rag__query mono">Query: {route.query}</p>
              <ol className="rag__steps">
                {route.steps.map((s, i) => (
                  <li key={s} className={i < shown ? 'is-on' : ''}>
                    {s}
                  </li>
                ))}
              </ol>
              <div className={`rag__answer rag__answer--${route.outcome} ${done ? 'is-on' : ''}`}>
                <span className="mono">{route.outcome === 'refusal' ? '✕ Refuses' : route.outcome === 'direct' ? '→ Direct answer' : '✓ Answers from the papers'}</span>
                <p>{route.result}</p>
              </div>
            </>
          ) : (
            <p className="muted">Pick a kind of query to see the path it takes.</p>
          )}
        </div>

        <div className="tiles">
          <div className="tile">
            <b>0.93</b>
            <span className="mono">held-out hit@5</span>
          </div>
          <div className="tile">
            <b>0.73</b>
            <span className="mono">nDCG@10 · SciFact (BEIR)</span>
          </div>
          <div className="tile">
            <b>12/12</b>
            <span className="mono">off-topic questions refused (held-out)</span>
          </div>
        </div>
      </div>
    </Figure>
  );
}
