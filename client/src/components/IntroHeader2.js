import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';


const IntroHeader2 = ({ onHomeClick, onIntroClick, onFeatureClick, onAboutClick, onTechClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        }
    }
    return 'light';
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const navItems = [
    { label: 'Home', action: onHomeClick },
    { label: 'Intro', action: onIntroClick },
    { label: 'Feature', action: onFeatureClick },
    { label: 'About', action: onAboutClick },
    { label: 'Tech Stack', action: onTechClick },
    { label: 'Docs', action: () => {} },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-slate-900 dark:text-white cursor-pointer" onClick={onHomeClick}>H2NQ</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-baseline space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
            <div className="flex items-center space-x-2">
                <Link to="/auth" className="text-slate-600 dark:text-slate-300 hover:text-[#379eff] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Log In
                </Link>
                <Link to="/auth" className="bg-[#379eff] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-opacity-90 transition">
                    Sign Up
                </Link>
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon className="h-5 w-5"/> : <SunIcon className="h-5 w-5"/>}
                </button>
            </div>
          </div>
           <div className="md:hidden">
              {/* Mobile menu button can be added here */}
           </div>
        </div>
      </div>
    </header>
  );
};

export default IntroHeader2;