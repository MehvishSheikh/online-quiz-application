import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const [dark, setDark] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(isDark);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <Button variant="outline" size="sm" onClick={() => setDark(!dark)}>
      {dark ? 'Light' : 'Dark'} mode
    </Button>
  );
};


