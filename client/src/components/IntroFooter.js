// Happy coding :D!
// Happy coding :D
import React from 'react';

const IntroFooter = ({ onHomeClick, onIntroClick, onFeatureClick, onAboutClick, onTechClick }) => {
    
  const navItems = [
    { label: 'Home', action: onHomeClick },
    { label: 'Intro', action: onIntroClick },
    { label: 'Feature', action: onFeatureClick },
    { label: 'About', action: onAboutClick },
    { label: 'Tech Stack', action: onTechClick },
  ];
    
  return (
    <footer className="bg-slate-100 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <span className="text-3xl font-bold text-slate-900 dark:text-white cursor-pointer" onClick={onHomeClick}>H2NQ</span>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              AI-Powered Learning Platform
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Navigation</h3>
                <ul className="mt-4 space-y-4">
                  {navItems.map(item => (
                     <li key={item.label}>
                       <button onClick={item.action} className="text-base text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                         {item.label}
                       </button>
                     </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <span className="text-base text-slate-600 dark:text-slate-300">Privacy Policy</span>
                  </li>
                  <li>
                    <span className="text-base text-slate-600 dark:text-slate-300">Terms of Service</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8">
          <p className="text-base text-slate-500 dark:text-slate-400 xl:text-center">&copy; {new Date().getFullYear()} H2NQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default IntroFooter;