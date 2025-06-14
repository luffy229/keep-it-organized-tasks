
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Sparkles, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate gradient based on scroll position
  const getBackgroundStyle = () => {
    const maxScroll = 1000;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    const startColor1 = [199, 210, 254]; // indigo-200
    const startColor2 = [255, 255, 255]; // white
    const startColor3 = [243, 232, 255]; // purple-100
    
    const endColor1 = [147, 197, 253]; // blue-300
    const endColor2 = [196, 181, 253]; // purple-300
    const endColor3 = [252, 165, 165]; // red-300
    
    const interpolateColor = (start: number[], end: number[], progress: number) => {
      return start.map((startVal, i) => 
        Math.round(startVal + (end[i] - startVal) * progress)
      );
    };
    
    const color1 = interpolateColor(startColor1, endColor1, scrollProgress);
    const color2 = interpolateColor(startColor2, endColor2, scrollProgress);
    const color3 = interpolateColor(startColor3, endColor3, scrollProgress);
    
    return {
      background: `linear-gradient(135deg, 
        rgb(${color1.join(',')}) 0%, 
        rgb(${color2.join(',')}) 50%, 
        rgb(${color3.join(',')}) 100%)`
    };
  };

  const navigationItems = [
    { path: '/', label: '🏠 Home', mobileLabel: 'Home' },
    { path: '/add-task', label: '➕ Add Task', mobileLabel: 'Add Task' },
  ];

  return (
    <div className="min-h-screen transition-all duration-300" style={getBackgroundStyle()}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20 pointer-events-none"></div>
      
      <header className="relative bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Stay Organized</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-6">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1">
                {navigationItems.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      location.pathname === path
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {user && (
                <div className="hidden sm:flex items-center space-x-3 lg:space-x-4 border-l border-gray-200 pl-3 lg:pl-6">
                  <div className="flex items-center space-x-2 lg:space-x-3 bg-white/60 rounded-xl px-3 py-2 shadow-sm">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}

              {/* Mobile User Menu */}
              {user && (
                <div className="sm:hidden flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <User size={12} className="text-white" />
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              {navigationItems.map(({ path, mobileLabel }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === path
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  {mobileLabel}
                </Link>
              ))}
              {user && (
                <div className="pt-3 border-t border-gray-200/50 mt-3">
                  <div className="flex items-center justify-between px-4 py-2 bg-white/60 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      
      <main className="relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;
