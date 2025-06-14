
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate gradient based on scroll position
  const getBackgroundStyle = () => {
    const maxScroll = 1000; // Adjust this value to control when the gradient fully transitions
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    // Define gradient colors based on scroll position
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

  return (
    <div className="min-h-screen transition-all duration-300" style={getBackgroundStyle()}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20 pointer-events-none"></div>
      
      <header className="relative bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12 xs:h-14 sm:h-16">
            <Link to="/" className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 group">
              <div className="relative">
                <div className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg xs:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Sparkles size={12} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 xs:-top-1 xs:-right-1 w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-sm xs:text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs text-gray-500 hidden xs:block">Stay Organized</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-6">
              <nav className="flex space-x-0.5 xs:space-x-1">
                <Link
                  to="/"
                  className={`px-1.5 xs:px-2 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/'
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm'
                  }`}
                >
                  <span className="hidden xs:inline">🏠 Home</span>
                  <span className="xs:hidden">🏠</span>
                </Link>
                <Link
                  to="/add-task"
                  className={`px-1.5 xs:px-2 sm:px-4 py-1.5 xs:py-2 rounded-lg xs:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/add-task'
                      ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-sm'
                  }`}
                >
                  <span className="hidden xs:inline">➕ Add Task</span>
                  <span className="xs:hidden">➕</span>
                </Link>
              </nav>

              {user && (
                <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-4 border-l border-gray-200 pl-1 xs:pl-2 sm:pl-6">
                  <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 bg-white/60 rounded-lg xs:rounded-xl px-1.5 xs:px-2 sm:px-4 py-1.5 xs:py-2 shadow-sm">
                    <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User size={10} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 hidden xs:inline max-w-20 sm:max-w-none truncate">{user.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1 xs:p-1.5 sm:p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg xs:rounded-xl transition-all duration-200 hover:scale-110"
                    title="Logout"
                  >
                    <LogOut size={12} className="xs:w-3.5 xs:h-3.5 sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative max-w-6xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-3 xs:py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
