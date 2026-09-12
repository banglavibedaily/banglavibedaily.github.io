import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar.jsx';

it('shows nav links, a subscribe button and a working theme toggle', async () => {
  const toggle = vi.fn();
  render(<Navbar theme="dark" toggle={toggle} />);

  expect(screen.getByRole('link', { name: /categories/i })).toHaveAttribute('href', '#categories');
  expect(screen.getAllByRole('link', { name: /subscribe/i }).length).toBeGreaterThan(0);

  await userEvent.click(screen.getByRole('button', { name: /switch to light mode/i }));
  expect(toggle).toHaveBeenCalled();
});

it('opens the mobile menu', async () => {
  render(<Navbar theme="dark" toggle={() => {}} />);

  const button = screen.getByRole('button', { name: /open menu/i });
  expect(button).toHaveAttribute('aria-expanded', 'false');

  await userEvent.click(button);
  expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');
});
