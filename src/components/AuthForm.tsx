import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  const [scrollY, setScrollY] = useState(0);
  const { login, register, isLoading } = useAuth();
  const { theme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Email validation
  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email is required';
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    // Check for Gmail format specifically
    if (email.includes('@gmail.com') && !email.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
      return 'Please enter a valid Gmail address';
    }
    
    return null;
  };

  // Password validation
  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    
    return null;
  };

  // Name validation
  const validateName = (name: string): string | null => {
    if (!name) return 'Name is required';
    
    if (name.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return 'Name can only contain letters and spaces';
    }
    
    return null;
  };

  // Real-time validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateEmail(value);
    setErrors(prev => ({ ...prev, email: error }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setErrors(prev => ({ ...prev, password: error }));
  };

  const handleNameChange = (value: string) => {
    setName(value);
    const error = validateName(value);
    setErrors(prev => ({ ...prev, name: error }));
  };

  // Get theme-based gradient colors
  const getBackgroundStyle = () => {
    const maxScroll = 800;
    const scrollProgress = Math.min(scrollY / maxScroll, 1);
    
    let startColors: [number, number, number][];
    let endColors: [number, number, number][];
    
    switch (theme) {
      case 'dark':
        startColors = [[31, 41, 55], [17, 24, 39], [55, 65, 81]];
        endColors = [[17, 24, 39], [31, 41, 55], [75, 85, 99]];
        break;
      case 'ocean':
        startColors = [[103, 232, 249], [59, 130, 246], [14, 165, 233]];
        endColors = [[6, 182, 212], [2, 132, 199], [3, 105, 161]];
        break;
      case 'sunset':
        startColors = [[251, 146, 60], [236, 72, 153], [245, 101, 101]];
        endColors = [[234, 88, 12], [219, 39, 119], [220, 38, 127]];
        break;
      case 'forest':
        startColors = [[74, 222, 128], [34, 197, 94], [132, 204, 22]];
        endColors = [[22, 163, 74], [21, 128, 61], [101, 163, 13]];
        break;
      case 'royal':
        startColors = [[168, 85, 247], [99, 102, 241], [139, 92, 246]];
        endColors = [[126, 34, 206], [67, 56, 202], [109, 40, 217]];
        break;
      default: // light
        startColors = [[199, 210, 254], [255, 255, 255], [243, 232, 255]];
        endColors = [[147, 197, 253], [196, 181, 253], [252, 165, 165]];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = !isLogin ? validateName(name) : null;
    
    setErrors({
      email: emailError,
      password: passwordError,
      name: nameError
    });
    
    // If there are errors, don't submit
    if (emailError || passwordError || nameError) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors below',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          toast({
            title: 'Login failed',
            description: 'Invalid email or password.',
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

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const formBg = isDark ? 'bg-gray-900/80' : 'bg-white/80';
  const inputBg = isDark ? 'bg-gray-800/70' : 'bg-white/70';
  const inputBorder = isDark ? 'border-gray-600' : 'border-gray-200';
  const labelColor = isDark ? 'text-gray-200' : 'text-gray-700';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 transition-all duration-300" style={getBackgroundStyle()}>
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-black/20 via-transparent to-black/10' : 'bg-gradient-to-br from-white/30 via-transparent to-white/20'} pointer-events-none`}></div>
      
      <div className="absolute top-4 right-4 z-50">
        <ThemeSelector />
      </div>
      
      <div className="relative w-full max-w-md space-y-6">
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles size={28} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Stay Organized ✨</p>
            </div>
          </div>
          <h2 className={`text-xl md:text-2xl font-bold ${textColor} mb-2`}>
            {isLogin ? '👋 Welcome Back!' : '🎉 Join TaskFlow'}
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm px-2`}>
            {isLogin ? 'Sign in to manage your tasks' : 'Create your account to get started'}
          </p>
        </div>

        <div className={`${formBg} backdrop-blur-md rounded-2xl shadow-2xl ${isDark ? 'border-gray-700/50' : 'border-white/20'} border p-6 md:p-8 animate-scale-in`}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="group">
                <label htmlFor="name" className={`block text-sm font-semibold ${labelColor} mb-2`}>
                  👤 Full Name
                </label>
                <div className="relative">
                  <User size={18} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'} transition-colors`} />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 ${inputBg} border ${
                      errors.name ? 'border-red-500' : inputBorder
                    } rounded-xl focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/50 focus:border-blue-400/50' : 'focus:ring-blue-500/50 focus:border-blue-500/50'} transition-all duration-300 shadow-sm hover:shadow-md ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'} text-base`}
                    placeholder="Enter your full name"
                    required={!isLogin}
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                )}
              </div>
            )}
            
            <div className="group">
              <label htmlFor="email" className={`block text-sm font-semibold ${labelColor} mb-2`}>
                📧 Email Address
              </label>
              <div className="relative">
                <Mail size={18} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'} transition-colors`} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 ${inputBg} border ${
                    errors.email ? 'border-red-500' : inputBorder
                  } rounded-xl focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/50 focus:border-blue-400/50' : 'focus:ring-blue-500/50 focus:border-blue-500/50'} transition-all duration-300 shadow-sm hover:shadow-md ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'} text-base`}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>
            
            <div className="group">
              <label htmlFor="password" className={`block text-sm font-semibold ${labelColor} mb-2`}>
                🔒 Password
              </label>
              <div className="relative">
                <Lock size={18} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'} transition-colors`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 ${inputBg} border ${
                    errors.password ? 'border-red-500' : inputBorder
                  } rounded-xl focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-400/50 focus:border-blue-400/50' : 'focus:ring-blue-500/50 focus:border-blue-500/50'} transition-all duration-300 shadow-sm hover:shadow-md ${isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'} text-base`}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'} transition-colors p-1`}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
              {!isLogin && !errors.password && (
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-3 space-y-1`}>
                  <p className="font-medium">Password requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs leading-relaxed">
                    <li>At least 8 characters long</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One number (0-9)</li>
                    <li>One special character (@$!%*?&)</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading || Object.values(errors).some(error => error !== null)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold flex items-center justify-center space-x-2 transform hover:scale-[1.02] text-base min-h-[3.5rem]"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isLogin ? '🚀 Sign In' : '✨ Create Account'}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors hover:underline py-2 px-4 rounded-lg"
              disabled={isLoading}
            >
              {isLogin ? "Don't have an account? Sign up 📝" : "Already have an account? Sign in 👋"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
