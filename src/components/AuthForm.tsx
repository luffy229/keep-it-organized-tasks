
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate gradient based on scroll position
  const getBackgroundStyle = () => {
    const maxScroll = 800;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          toast({
            title: 'Login failed',
            description: 'Invalid email or password. Try demo@example.com with password "password"',
            variant: 'destructive',
          });
        }
      } else {
        success = await register(email, password, name);
        if (!success) {
          toast({
            title: 'Registration failed',
            description: 'User with this email already exists',
            variant: 'destructive',
          });
        }
      }
      
      if (success) {
        toast({
          title: isLogin ? 'Welcome back!' : 'Account created!',
          description: `You have successfully ${isLogin ? 'logged in' : 'registered'}`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 transition-all duration-300" style={getBackgroundStyle()}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20 pointer-events-none"></div>
      
      <div className="relative max-w-md w-full space-y-6 sm:space-y-8">
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <div className="relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles size={24} className="sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Stay Organized ✨</p>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? '👋 Welcome Back!' : '🎉 Join TaskFlow'}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {isLogin ? 'Sign in to manage your tasks' : 'Create your account to get started'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {!isLogin && (
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Full Name
                </label>
                <div className="relative">
                  <User size={16} className="sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
                    placeholder="Enter your full name"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <Lock size={16} className="sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold flex items-center justify-center space-x-2 transform hover:scale-105 text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isLogin ? '🚀 Sign In' : '✨ Create Account'}</span>
                  <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors hover:underline"
              disabled={isLoading}
            >
              {isLogin ? "Don't have an account? Sign up 📝" : "Already have an account? Sign in 👋"}
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <p className="text-xs sm:text-sm text-gray-700 text-center">
                <span className="font-semibold">🎯 Demo credentials:</span><br />
                <span className="text-blue-600">📧 demo@example.com</span><br />
                <span className="text-purple-600">🔑 password</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
