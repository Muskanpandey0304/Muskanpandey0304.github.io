import { useEffect, useRef, useState } from 'react';
import Figure from '../components/Figure';
import { guardGates, guardScenarios, type Verdict } from '../content/demos';
import { useReducedMotion } from '../hooks/useMotion';

type Status = 'idle' | 'running' | 'done';

const VERDICT_TEXT: Record<Verdict, string> = {
  ALLOW: '✓ ALLOW',
  NEEDS_APPROVAL: '⚠ NEEDS APPROVAL',
  BLOCK: '✕ BLOCK'
};

export default function AttackSimulator() {
  const reduced = useReducedMotion();
  const [id, setId] = useState(guardScenarios[0].id);
  const [status, setStatus] = useState<Status>('idle');
  const [step, setStep] = useState(-1); // gate currently being checked
  const [log, setLog] = useState<string[]>([]);
  const timer = useRef(0);
  const sc = guardScenarios.find((s) => s.id === id)!;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const reset = (next: string) => {
    window.clearTimeout(timer.current);
    setId(next);
    setStatus('idle');
    setStep(-1);
  };

  const run = () => {
    window.clearTimeout(timer.current);
    setStatus('running');
    const delay = reduced ? 0 : 380;
    let i = 0;
    const advance = () => {
      setStep(i);
      if (i >= sc.stopAt) {
        timer.current = window.setTimeout(() => {
          setStatus('done');
          setLog((l) => [`${new Date().toISOString().slice(11, 19)} ${sc.verdict} · ${sc.label}`, ...l].slice(0, 5));
        }, delay);
        return;
      }
      i++;
      timer.current = window.setTimeout(advance, delay);
    };
    timer.current = window.setTimeout(advance, delay / 2);
  };

  const gateState = (i: number) => {
    if (status === 'idle' || step < i) return 'wait';
    if (i === step && status === 'running') return 'check';
    if (i === sc.stopAt && status === 'done') {
      if (sc.verdict === 'BLOCK') return 'fail';
      if (sc.verdict === 'NEEDS_APPROVAL') return 'warn';
    }
    return 'ok';
  };
  const endLabel = sc.verdict === 'ALLOW' ? 'Run tool' : sc.verdict === 'NEEDS_APPROVAL' ? 'Ask a human' : 'Not run';
  const endState = status !== 'done' ? '' : sc.verdict === 'ALLOW' ? 'gate--ok' : sc.verdict === 'NEEDS_APPROVAL' ? 'gate--warn' : 'gate--fail';

  return (
    <Figure n={4} caption="GuardML’s guard checks every tool call in this order. Scenarios and verdicts come from the project README.">
      <div className="attack">
        <div className="attack__controls">
          <label className="mono" htmlFor="scenario">
            Scenario
          </label>
          <select id="scenario" value={id} onChange={(e) => reset(e.target.value)}>
            {guardScenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <button className="btn btn--primary" onClick={run} disabled={status === 'running'}>
            ▶ Run through the guard
          </button>
        </div>
        <p className="attack__req">“{sc.request}”</p>

        <ol className="gates">
          {guardGates.map((g, i) => (
            <li key={g} className={`gate gate--${gateState(i)}`}>
              <span className="gate__n">{i + 1}</span>
              {g}
            </li>
          ))}
          <li className={`gate gate--end ${endState}`}>{endLabel}</li>
        </ol>

        <p className={`attack__result mono ${status === 'done' ? sc.verdict : ''}`} role="status" aria-live="polite">
          {status === 'idle' && 'Choose a scenario and run it through the eight checks.'}
          {status === 'running' && 'Checking…'}
          {status === 'done' && `${VERDICT_TEXT[sc.verdict]} at “${guardGates[sc.stopAt]}”: ${sc.reason}`}
        </p>

        <pre className="attack__log mono" aria-label="Session log">
          {log.length ? log.join('\n') : '# session log (this page only)'}
        </pre>

        <div className="pairs">
          <Pair label="GuardBench, 62 scenarios (offline worst case)" from={100} to={5} fromTxt="100% (44/44) no guard" toTxt="5% (2/44) ToolGuard + provenance" />
          <Pair label="AgentDojo, banking, 40 cases" from={65} to={0} fromTxt="65% (26/40) no guard" toTxt="0% (0/40) provenance + intent check" />
        </div>
        <p className="attack__note mono">
          If a human rubber-stamps every approval, GuardBench attack success is 36% (16/44). On AgentDojo, normal tasks completed fell from 5/8 to 3/8.
        </p>
      </div>
    </Figure>
  );
}

function Pair({ label, from, to, fromTxt, toTxt }: { label: string; from: number; to: number; fromTxt: string; toTxt: string }) {
  return (
    <div className="pair">
      <span className="mono pair__label">{label}</span>
      <div className="pair__row">
        <span className="pair__bar pair__bar--before" style={{ width: `${from}%` }} />
        <span className="mono">{fromTxt}</span>
      </div>
      <div className="pair__row">
        <span className="pair__bar pair__bar--after" style={{ width: `${Math.max(to, 1)}%` }} />
        <span className="mono">{toTxt}</span>
      </div>
    </div>
  );
}
