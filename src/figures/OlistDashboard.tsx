import Figure from '../components/Figure';
import CountUp from '../components/CountUp';
import { useInView } from '../hooks/useMotion';

function Stars({ value, tone }: { value: number; tone: 'ok' | 'bad' }) {
  return (
    <span className={`stars stars--${tone}`} role="img" aria-label={`${value} out of 5 stars`}>
      <span className="stars__base" aria-hidden="true">★★★★★</span>
      <span className="stars__fill" aria-hidden="true" style={{ width: `${(value / 5) * 100}%` }}>★★★★★</span>
    </span>
  );
}

export default function OlistDashboard() {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <Figure n={6} caption="Olist, ~100k orders, 2016–2018.">
      <div ref={ref} className={`olist ${inView ? 'is-in' : ''}`}>
        <div className="olist__tile">
          <h4 className="mono">Repeat customers</h4>
          <div className="waffle" role="img" aria-label="3 in 100 customers buy twice">
            {Array.from({ length: 100 }, (_, i) => (
              <i key={i} className={i < 3 ? 'on' : ''} style={{ transitionDelay: `${i * 6}ms` }} />
            ))}
          </div>
          <p>3 in 100 customers come back.</p>
        </div>

        <div className="olist__tile">
          <h4 className="mono">Average review</h4>
          <div className="olist__stars">
            <div>
              <Stars value={4.29} tone="ok" /> <b>4.29</b> <span className="mono">on time</span>
            </div>
            <div>
              <Stars value={2.57} tone="bad" /> <b>2.57</b> <span className="mono">late</span>
            </div>
          </div>
        </div>

        <div className="olist__tile">
          <h4 className="mono">The honest twist</h4>
          <p>
            Late delivery hurts ratings… but does it hurt repeat buying within 90 days (2.03% after a late first order vs 2.31% after an on-time one)?{' '}
            <abbr title="p-value: the chance of seeing a gap this large if late delivery had no effect on repeat purchases. 0.15 is above the usual 0.05 cut-off, so the effect is not statistically measurable.">
              <b>p = 0.15</b>
            </abbr>
            : no measurable effect.
          </p>
        </div>

        <div className="olist__tile">
          <h4 className="mono">Opportunity (upper bound)</h4>
          <p className="olist__big">
            <CountUp prefix="R$" to={1.5} decimals={1} suffix="M" />
          </p>
          <p className="mono">11.5% · test designed to validate</p>
        </div>
      </div>
    </Figure>
  );
}
