
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-200 hover:scale-105 shadow-sm"
        title="Change theme"
      >
        <Palette size={18} className="text-gray-700" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-3 min-w-48">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose Theme</h3>
            <div className="space-y-2">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => {
                    setTheme(themeOption.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                    theme === themeOption.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${themeOption.colors}`} />
                    <span className="text-sm font-medium">{themeOption.label}</span>
                  </div>
                  {theme === themeOption.value && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
