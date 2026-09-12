import { render, screen } from '@testing-library/react';
import Button from '../Button.jsx';
import SectionHeading from '../SectionHeading.jsx';

it('renders a link button for external urls', () => {
  render(<Button href="https://www.youtube.com/@BanglaVibeDaily">Subscribe</Button>);
  const link = screen.getByRole('link', { name: /subscribe/i });
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
});

it('renders a plain button without href', () => {
  render(<Button>Click</Button>);
  expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
});

it('shows the Bangla subtitle with lang', () => {
  render(<SectionHeading title="Our Vibe" titleBn="আমাদের ভাইব" />);
  expect(screen.getByText('আমাদের ভাইব')).toHaveAttribute('lang', 'bn');
});
