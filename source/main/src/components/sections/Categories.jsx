import { FiFilm, FiBookOpen, FiZap, FiGlobe, FiTrendingUp, FiSmile, FiCpu } from 'react-icons/fi';
import Section from '../layout/Section.jsx';
import Card from '../ui/Card.jsx';
import { categories } from '../../data/content.js';

const ICONS = {
  stories: FiFilm,
  facts: FiBookOpen,
  ideas: FiZap,
  world: FiGlobe,
  trending: FiTrendingUp,
  entertainment: FiSmile,
  tech: FiCpu,
};

export default function Categories() {
  return (
    <Section
      id="categories"
      eyebrow="Categories"
      title="What you'll find here"
      titleBn="এখানে যা পাবেন"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = ICONS[category.id] ?? FiZap;
          return (
            <Card key={category.id} className="hover:-translate-y-1 hover:border-green">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green/10 text-green">
                  <Icon aria-hidden="true" className="text-xl" />
                </span>
                <span aria-hidden="true" className="text-2xl">
                  {category.emoji}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wide">{category.name}</h3>
              <p lang="bn" className="mt-1 font-bangla text-base text-green">
                {category.nameBn}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{category.blurb}</p>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
