import { useEffect, useState } from 'react';

let push: (msg: string) => void = () => {};
export const toast = (msg: string) => push(msg);

export default function Toast() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    let t: number;
    push = (m) => {
      setMsg(m);
      window.clearTimeout(t);
      t = window.setTimeout(() => setMsg(''), 2200);
    };
    return () => {
      window.clearTimeout(t);
      push = () => {};
    };
  }, []);
  return (
    <div className={`toast ${msg ? 'is-on' : ''}`} role="status" aria-live="polite">
      {msg}
    </div>
  );
}
