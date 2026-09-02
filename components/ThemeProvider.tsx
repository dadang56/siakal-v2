'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<Theme>('light');

  useEffect(() => {
    // Force Light Theme permanently - remove dark mode class from HTML root
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    try {
      localStorage.setItem('siakal_theme', 'light');
    } catch (e) {}
  }, []);

  const setTheme = () => {
    // Locked to Light Theme
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
