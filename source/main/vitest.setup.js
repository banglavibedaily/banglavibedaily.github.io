import '@testing-library/jest-dom/vitest';

// Node-environment test files (the feed/videos scripts) have no window.
if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia || function matchMedia(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent() { return false; },
    };
  };

  window.scrollTo = window.scrollTo || function scrollTo() {};

  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}
