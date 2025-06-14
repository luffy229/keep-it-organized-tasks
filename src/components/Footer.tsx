
import React from 'react';
import { Heart, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <span>Made with</span>
            <Heart size={16} className="text-red-500" />
            <span>using TaskFlow</span>
          </div>
          
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            © 2024 TaskFlow. Stay organized, stay productive.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
