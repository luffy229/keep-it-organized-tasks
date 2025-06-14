
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, LogOut, Sparkles } from 'lucide-react';
import Footer from './Footer';
import ThemeSelector from './ThemeSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get theme-based gradient colors
  const getThemeGradient = () => {
    const maxScroll = 1000;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    let startColors: [number, number, number][];
    let endColors: [number, number, number][];
    
    switch (theme) {
      case 'dark':
        startColors = [[31, 41, 55], [17, 24, 39], [55, 65, 81]]; // gray-800, gray-900, gray-700
        endColors = [[17, 24, 39], [31, 41, 55], [75, 85, 99]]; // gray-900, gray-800, gray-600
        break;
      case 'ocean':
        startColors = [[103, 232, 249], [59, 130, 246], [14, 165, 233]]; // cyan-300, blue-500, sky-500
        endColors = [[6, 182, 212], [2, 132, 199], [3, 105, 161]]; // cyan-500, blue-600, sky-700
        break;
      case 'sunset':
        startColors = [[251, 146, 60], [236, 72, 153], [245, 101, 101]]; // orange-400, pink-500, red-400
        endColors = [[234, 88, 12], [219, 39, 119], [220, 38, 127]]; // orange-600, pink-600, pink-600
        break;
      case 'forest':
        startColors = [[74, 222, 128], [34, 197, 94], [132, 204, 22]]; // green-400, green-500, lime-500
        endColors = [[22, 163, 74], [21, 128, 61], [101, 163, 13]]; // green-600, green-700, lime-600
        break;
      case 'royal':
        startColors = [[168, 85, 247], [99, 102, 241], [139, 92, 246]]; // purple-500, indigo-500, violet-500
        endColors = [[126, 34, 206], [67, 56, 202], [109, 40, 217]]; // purple-700, indigo-700, violet-700
        break;
      default: // light
        startColors = [[199, 210, 254], [255, 255, 255], [243, 232, 255]]; // indigo-200, white, purple-100
        endColors = [[147, 197, 253], [196, 181, 253], [252, 165, 165]]; // blue-300, purple-300, red-300
        break;
    }
    
    const interpolateColor = (start: [number, number, number], end: [number, number, number], progress: number) => {
      return start.map((startVal, i) => 
        Math.round(startVal + (end[i] - startVal) * progress)
      );
    };
    
    const color1 = interpolateColor(startColors[0], endColors[0], scrollProgress);
    const color2 = interpolateColor(startColors[1], endColors[1], scrollProgress);
    const color3 = interpolateColor(startColors[2], endColors[2], scrollProgress);
    
    return {
      background: `linear-gradient(135deg, 
        rgb(${color1.join(',')}) 0%, 
        rgb(${color2.join(',')}) 50%, 
        rgb(${color3.join(',')}) 100%)`
    };
  };

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const headerBg = isDark ? 'bg-gray-900/80' : 'bg-white/80';
  const navItemActiveColor = isDark ? 'bg-gray-700 text-blue-300' : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700';
  const navItemHoverColor = isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/60' : 'text-gray-600 hover:text-gray-900 hover:bg-white/60';

  return (
    <div className="min-h-screen transition-all duration-300" style={getThemeGradient()}>
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-black/20 via-transparent to-black/10' : 'bg-gradient-to-br from-white/30 via-transparent to-white/20'} pointer-events-none`}></div>
      
      <header className={`relative ${headerBg} backdrop-blur-md shadow-lg ${isDark ? 'border-gray-700/50' : 'border-white/20'} border-b sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  TaskFlow
                </h1>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stay Organized</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/'
                      ? navItemActiveColor + ' shadow-md'
                      : navItemHoverColor + ' hover:shadow-sm'
                  }`}
                >
                  🏠 Home
                </Link>
                <Link
                  to="/add-task"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/add-task'
                      ? navItemActiveColor + ' shadow-md'
                      : navItemHoverColor + ' hover:shadow-sm'
                  }`}
                >
                  ➕ Add Task
                </Link>
              </nav>

              <ThemeSelector />

              {user && (
                <div className={`flex items-center space-x-4 border-l ${isDark ? 'border-gray-600' : 'border-gray-200'} pl-6`}>
                  <div className={`flex items-center space-x-3 ${isDark ? 'bg-gray-800/60' : 'bg-white/60'} rounded-xl px-4 py-2 shadow-sm`}>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className={`p-2 ${isDark ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'} rounded-xl transition-all duration-200 hover:scale-110`}
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
