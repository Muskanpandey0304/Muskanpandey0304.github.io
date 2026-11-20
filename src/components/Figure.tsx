import type { ReactNode } from 'react';

type Props = { n: number; caption: string; children: ReactNode; badge?: string };

export default function Figure({ n, caption, children, badge }: Props) {
  return (
    <figure className="figure">
      <div className="figure__body">
        {badge && <span className="badge badge--warn">{badge}</span>}
        {children}
      </div>
      <figcaption>
        Fig. {n} — {caption}
      </figcaption>
    </figure>
  );
}
