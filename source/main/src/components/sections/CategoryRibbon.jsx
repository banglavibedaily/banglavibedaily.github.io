import { categories } from '../../data/content.js';

const items = [...categories, ...categories];

export default function CategoryRibbon() {
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-border bg-surface/60 py-4">
      <div className="flex w-max animate-marquee items-center gap-10 pr-10">
        {items.map((category, index) => (
          <span
            key={`${category.id}-${index}`}
            className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-muted"
          >
            <span className="text-lg">{category.emoji}</span>
            {category.name}
          </span>
        ))}
      </div>
    </div>
  );
}
