import { render, screen } from '@testing-library/react';
import Categories from '../Categories.jsx';
import Follow from '../Follow.jsx';
import Footer from '../../layout/Footer.jsx';
import { categories } from '../../../data/content.js';

it('renders a card per category with its Bangla name', () => {
  render(<Categories />);

  categories.forEach((category) => {
    expect(screen.getByText(category.name)).toBeInTheDocument();
    expect(screen.getByText(category.nameBn)).toHaveAttribute('lang', 'bn');
  });
});

it('links to both platforms', () => {
  render(<Follow />);

  expect(screen.getByRole('link', { name: /youtube/i })).toHaveAttribute(
    'href',
    expect.stringContaining('youtube.com')
  );
  expect(screen.getByRole('link', { name: /facebook/i })).toHaveAttribute(
    'href',
    expect.stringContaining('facebook.com')
  );
});

it('footer shows the current year', () => {
  render(<Footer />);
  expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
});
