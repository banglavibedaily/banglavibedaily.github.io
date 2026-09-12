import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme.js';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = '';
});

it('defaults to dark and toggles to light', () => {
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('dark');
  expect(document.documentElement.classList.contains('dark')).toBe(true);

  act(() => result.current.toggle());

  expect(result.current.theme).toBe('light');
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  expect(localStorage.getItem('bvd-theme')).toBe('light');
});

it('restores the saved theme', () => {
  localStorage.setItem('bvd-theme', 'light');
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('light');
});
