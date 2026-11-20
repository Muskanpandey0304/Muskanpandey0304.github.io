import { useEffect, useRef, useState } from 'react';
import Figure from '../components/Figure';
import { useReducedMotion } from '../hooks/useMotion';

const T_US = 1.7;
const T_VLLM = 11.1;

export default function PrefillRace() {
  const reduced = useReducedMotion();
  const [t, setT] = useState(reduced ? T_VLLM : 0);
  const [running, setRunning] = useState(false);
  const raf = useRef(0);

  const stop = () => cancelAnimationFrame(raf.current);
  useEffect(() => stop, []);

  const run = () => {
    stop();
    setT(0);
    setRunning(true);
    const start = performance.now();
    const tick = (now: number) => {
      const s = Math.min((now - start) / 1000, T_VLLM);
      setT(s);
      if (s < T_VLLM) raf.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const skip = () => {
    stop();
    setT(T_VLLM);
    setRunning(false);
  };

  const us = Math.min(t, T_US);
  const vllm = Math.min(t, T_VLLM);
  const usDone = t >= T_US;
  const vllmDone = t >= T_VLLM;

  return (
    <Figure n={3} caption="Long-prompt prefill latency, Tesla T4. Lower is better.">
      <div className="race">
        <div className="race__lane">
          <span className="race__name">TuringServe</span>
          <div className="race__track" role="img" aria-label={`TuringServe finishes in ${T_US} seconds`}>
            <div className="race__bar race__bar--us" style={{ width: `${(us / T_VLLM) * 100}%` }} />
          </div>
          <span className="race__time mono">{usDone ? `✓ ${T_US.toFixed(1)} s` : `${us.toFixed(1)} s`}</span>
        </div>
        <div className="race__lane">
          <span className="race__name">vLLM</span>
          <div className="race__track" role="img" aria-label={`vLLM finishes in ${T_VLLM} seconds`}>
            <div className="race__bar race__bar--them" style={{ width: `${(vllm / T_VLLM) * 100}%` }} />
          </div>
          <span className="race__time mono">{vllmDone ? `${T_VLLM.toFixed(1)} s` : `${vllm.toFixed(1)} s`}</span>
        </div>
        <div className="race__foot">
          <button className="btn btn--primary" onClick={run} disabled={running}>
            ▶ Run race (real time)
          </button>
          {running && (
            <button className="link" onClick={skip}>
              skip ⏭
            </button>
          )}
          <span className="race__stat mono" aria-live="polite">
            {vllmDone ? '6.6× faster · +38% throughput at 64 concurrent users' : 'Press run to feel the difference.'}
          </span>
        </div>
      </div>
    </Figure>
  );
}
