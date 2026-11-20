import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useInView, useReducedMotion } from '../hooks/useMotion';

type Props = { to: number; decimals?: number; prefix?: string; suffix?: string; duration?: number; className?: string };

export default function CountUp({ to, decimals = 0, prefix = '', suffix = '', duration = 1.2, className }: Props) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [val, setVal] = useState(reduced ? to : 0);

  useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    if (!inView) return;
    const o = { v: 0 };
    const tw = gsap.to(o, { v: to, duration, ease: 'expo.out', onUpdate: () => setVal(o.v) });
    return () => {
      tw.kill();
    };
  }, [inView, to, duration, reduced]);

  const text = new Intl.NumberFormat('en', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(val);
  return (
    <span ref={ref} className={className} aria-label={`${prefix}${to}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {text}
        {suffix}
      </span>
    </span>
  );
}
