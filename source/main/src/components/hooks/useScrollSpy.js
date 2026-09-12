import { useEffect, useState } from 'react';

export function useScrollSpy(ids, offset = 120) {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    function onScroll() {
      let current = ids[0] ?? '';
      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= offset) current = id;
      });
      setActive(current);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids, offset]);

  return active;
}
