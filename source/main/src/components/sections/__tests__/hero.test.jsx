import { render, screen, within } from '@testing-library/react';
import Hero from '../Hero.jsx';

it('shows the wordmark, tagline and both calls to action', () => {
  render(<Hero />);

  const heading = screen.getByRole('heading', { level: 1 });
  expect(within(heading).getByText(/VIBE/)).toBeInTheDocument();

  expect(screen.getByText('বাংলার ভাইব, বিশ্বের গল্প')).toHaveAttribute('lang', 'bn');

  expect(screen.getByRole('link', { name: /subscribe on youtube/i })).toHaveAttribute(
    'href',
    expect.stringContaining('sub_confirmation=1')
  );
  expect(screen.getByRole('link', { name: /follow on facebook/i })).toHaveAttribute(
    'href',
    'https://www.facebook.com/BanglaVibeDaily'
  );
});
