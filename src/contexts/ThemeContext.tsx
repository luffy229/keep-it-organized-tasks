
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'ocean' | 'sunset' | 'forest' | 'royal';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { value: Theme; label: string; colors: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
  { 
    value: 'light' as Theme, 
    label: '☀️ Light', 
    colors: 'from-blue-200 to-purple-200' 
  },
  { 
    value: 'dark' as Theme, 
    label: '🌙 Dark', 
    colors: 'from-gray-800 to-gray-900' 
  },
  { 
    value: 'ocean' as Theme, 
    label: '🌊 Ocean', 
    colors: 'from-cyan-400 to-blue-600' 
  },
  { 
    value: 'sunset' as Theme, 
    label: '🌅 Sunset', 
    colors: 'from-orange-400 to-pink-600' 
  },
  { 
    value: 'forest' as Theme, 
    label: '🌲 Forest', 
    colors: 'from-green-400 to-emerald-600' 
  },
  { 
    value: 'royal' as Theme, 
    label: '👑 Royal', 
    colors: 'from-purple-500 to-indigo-700' 
  }
];

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('taskflow-theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('taskflow-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
