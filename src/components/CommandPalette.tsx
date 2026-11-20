import { useEffect, useMemo, useRef, useState } from 'react';
import { profile } from '../content/profile';
import { useLens } from '../hooks/useLens';
import type { Theme } from '../hooks/useTheme';
import { copyEmail } from '../sections/Contact';

type Cmd = { id: string; label: string; run: () => void };

type Props = { open: boolean; onClose: () => void; setTheme: (t: Theme) => void };

export default function CommandPalette({ open, onClose, setTheme }: Props) {
  const { lens, setLens } = useLens();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const [msg, setMsg] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const go = (hash: string) => () => {
    onClose();
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  const cmds: Cmd[] = useMemo(
    () => [
      { id: 'go work', label: 'go work — jump to selected work', run: go('#work') },
      { id: 'go skills', label: 'go skills', run: go('#skills') },
      { id: 'go record', label: 'go record', run: go('#record') },
      { id: 'go contact', label: 'go contact', run: go('#contact') },
      { id: 'lens ml', label: 'lens ml — AI/ML Engineer view', run: () => (setLens('ml'), onClose()) },
      { id: 'lens data', label: 'lens data — Data Analyst view', run: () => (setLens('data'), onClose()) },
      { id: 'run race', label: 'run race — TuringServe', run: go('#turingserve') },
      { id: 'attack', label: 'attack — GuardML simulator', run: go('#guardml') },
      { id: 'ask rag', label: 'ask rag — AdaptiveRAG', run: go('#adaptiverag') },
      { id: 'resume', label: `resume — download ${lens === 'ml' ? 'AI/ML' : 'Data Analyst'} PDF`, run: () => (window.open(profile.resumes[lens], '_blank'), onClose()) },
      { id: 'copy email', label: 'copy email', run: () => (copyEmail(), onClose()) },
      { id: 'theme dark', label: 'theme dark', run: () => (setTheme('dark'), onClose()) },
      { id: 'theme light', label: 'theme light', run: () => (setTheme('light'), onClose()) },
      { id: 'whoami', label: 'whoami', run: () => setMsg('Muskan Pandey. AI/ML + data. Builds it, then proves it.') },
      {
        id: 'sudo hire muskan',
        label: 'sudo hire muskan',
        run: () => {
          setMsg('Permission granted. Opening email…');
          window.setTimeout(() => (window.location.href = `mailto:${profile.email}?subject=Hello%20Muskan`), 600);
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lens, setLens, setTheme, onClose]
  );

  const list = cmds.filter((c) => c.id.includes(q.trim().toLowerCase()) || c.label.toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(() => {
    if (open) {
      setQ('');
      setIdx(0);
      setMsg('');
      window.setTimeout(() => input.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => setIdx(0), [q]);

  if (!open) return null;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') (e.preventDefault(), setIdx((i) => Math.min(i + 1, list.length - 1)));
    else if (e.key === 'ArrowUp') (e.preventDefault(), setIdx((i) => Math.max(i - 1, 0)));
    else if (e.key === 'Enter') list[idx]?.run();
    else if (e.key === 'Tab') {
      // keep focus trapped in the single input
      e.preventDefault();
      input.current?.focus();
    }
  };

  return (
    <div className="palette-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panel} className="palette" role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKey}>
        <input
          ref={input}
          autoFocus
          className="palette__input mono"
          placeholder="type a command…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={list[idx] ? `cmd-${idx}` : undefined}
        />
        <ul id="palette-list" role="listbox" className="palette__list mono">
          {list.map((c, i) => (
            <li key={c.id} id={`cmd-${i}`} role="option" aria-selected={i === idx} className={i === idx ? 'is-on' : ''} onMouseEnter={() => setIdx(i)} onClick={c.run}>
              {c.label}
            </li>
          ))}
          {!list.length && <li className="muted">no match</li>}
        </ul>
        {msg && (
          <p className="palette__msg mono" role="status">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
