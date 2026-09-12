import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

it('renders every section heading in order', () => {
  render(<App />);

  ['What you', 'Latest videos', 'Our Vibe', 'Follow'].forEach((text) => {
    expect(screen.getByRole('heading', { name: new RegExp(text, 'i') })).toBeInTheDocument();
  });

  expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#main');
});
