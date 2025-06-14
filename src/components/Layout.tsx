
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, LogOut, Sparkles, Menu, X, Home, Plus } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const closeDrawer = () => setIsDrawerOpen(false);

  const NavLinks = ({ isMobile = false, onLinkClick = () => {} }) => (
    <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'space-x-1'}`}>
      <Link
        to="/"
        onClick={onLinkClick}
        className={`group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
          location.pathname === '/'
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
            : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} hover:shadow-md`
        }`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          location.pathname === '/' 
            ? 'bg-white/20' 
            : `${isDark ? 'bg-gray-700' : 'bg-gray-200'} group-hover:scale-110`
        } transition-all duration-300`}>
          <Home size={16} className={location.pathname === '/' ? 'text-white' : ''} />
        </div>
        <span className="text-sm font-medium">Home</span>
      </Link>
      
      <Link
        to="/add-task"
        onClick={onLinkClick}
        className={`group flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
          location.pathname === '/add-task'
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
            : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800/60' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} hover:shadow-md`
        }`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          location.pathname === '/add-task' 
            ? 'bg-white/20' 
            : `${isDark ? 'bg-gray-700' : 'bg-gray-200'} group-hover:scale-110`
        } transition-all duration-300`}>
          <Plus size={16} className={location.pathname === '/add-task' ? 'text-white' : ''} />
        </div>
        <span className="text-sm font-medium">Add Task</span>
      </Link>
    </div>
  );

  const UserSection = ({ isMobile = false, onLogoutClick = () => {} }) => (
    <div className={`flex flex-col space-y-4`}>
      {/* Theme Selector */}
      <div className="space-y-2">
        <h4 className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Theme</h4>
        <ThemeSelector />
      </div>
      
      {user && (
        <>
          {/* User Profile */}
          <div className={`p-4 ${isDark ? 'bg-gray-800/60' : 'bg-gray-50'} rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User size={20} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>{user.name}</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active now</p>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              onLogoutClick();
            }}
            className={`flex items-center justify-center space-x-3 w-full p-3 ${isDark ? 'text-red-400 hover:bg-red-900/20 border-red-800/30' : 'text-red-600 hover:bg-red-50 border-red-200'} border rounded-xl transition-all duration-200 hover:scale-[1.02] group`}
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Sign Out</span>
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen transition-all duration-300" style={getThemeGradient()}>
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-black/20 via-transparent to-black/10' : 'bg-gradient-to-br from-white/30 via-transparent to-white/20'} pointer-events-none`}></div>
      
      <header className={`relative ${headerBg} backdrop-blur-md shadow-lg ${isDark ? 'border-gray-700/50' : 'border-white/20'} border-b sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  TaskFlow
                </h1>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stay Organized</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavLinks />
              <div className={`border-l ${isDark ? 'border-gray-600' : 'border-gray-200'} pl-6`}>
                <UserSection />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <button
                    className={`p-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-200`}
                  >
                    <Menu size={24} />
                  </button>
                </DrawerTrigger>
                <DrawerContent className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} max-h-[85vh]`}>
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles size={20} className="text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>TaskFlow</h2>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stay Organized</p>
                        </div>
                      </div>
                      <DrawerClose asChild>
                        <button className={`p-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-all duration-200`}>
                          <X size={20} />
                        </button>
                      </DrawerClose>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      {/* Navigation Section */}
                      <div className="space-y-3">
                        <h3 className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Navigation</h3>
                        <NavLinks isMobile onLinkClick={closeDrawer} />
                      </div>

                      {/* Account Section */}
                      <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-4`}>Account</h3>
                        <UserSection isMobile onLogoutClick={closeDrawer} />
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
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
