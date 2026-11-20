import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../hooks/useMotion';

type Props = { as?: ElementType; className?: string; delay?: number; children: ReactNode; id?: string };

/** Fades content up once when it enters the viewport (CSS does the work; reduced motion shows it instantly). */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, id }: Props) {
  const [ref, inView] = useInView<HTMLElement>();
  const style = { '--d': `${delay}ms` } as CSSProperties;
  return (
    <Tag id={id} ref={ref} className={`reveal ${inView ? 'is-in' : ''} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
