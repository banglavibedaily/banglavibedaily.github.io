export default function SectionHeading({ title, titleBn, eyebrow }) {
  return (
    <div className="mb-12 text-center">
      {eyebrow && (
        <p className="mb-3 font-display text-xs font-bold uppercase tracking-[0.35em] text-red">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold uppercase tracking-wide sm:text-4xl">{title}</h2>
      {titleBn && (
        <p lang="bn" className="mt-2 font-bangla text-lg text-muted">
          {titleBn}
        </p>
      )}
    </div>
  );
}
