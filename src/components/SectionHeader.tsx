type Props = { num: string; title: string; meta?: string; id?: string };

export default function SectionHeader({ num, title, meta }: Props) {
  return (
    <div className="sec-head">
      <span className="sec-head__num">§{num}</span>
      <span className="sec-head__rule" aria-hidden="true" />
      <h2 className="sec-head__title">{title}</h2>
      <span className="sec-head__rule" aria-hidden="true" />
      {meta && <span className="sec-head__meta">{meta}</span>}
    </div>
  );
}
