import React, { useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MongoDbIcon from './components/icons/MongoDbIcon';
import VercelIcon from './components/icons/VercelIcon';
import GithubIcon from './components/icons/GithubIcon';
import GitflowIcon from './components/icons/GitflowIcon';
import BrainCircuitIcon from './components/icons/BrainCircuitIcon';
import WhiteboardIcon from './components/icons/WhiteboardIcon';
import MemoryIcon from './components/icons/MemoryIcon';
import UIIcon from './components/icons/UIIcon';
import ChatIcon from './components/icons/ChatIcon';
import ProgressIcon from './components/icons/ProgressIcon';
import CollaborationIcon from './components/icons/CollaborationIcon';

const App: React.FC = () => {
  const homeRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const featureRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const techRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const team = [
    { name: 'Vu Trong Hiep', role: 'Main full-stack coder' },
    { name: 'Le Tam Nhu', role: 'Designer Logo UI/UX' },
    { name: 'Nguyen Lam Quynh', role: 'Designer Logo UI/UX' },
    { name: 'Tran Duc Huy', role: 'Slide maker' },
    { name: 'Gemini Cli', role: 'Codebase support' },
  ];

  const technologies = [
    { name: 'MongoDB Atlas', icon: <MongoDbIcon /> },
    { name: 'Vercel', icon: <VercelIcon /> },
    { name: 'GitHub', icon: <GithubIcon /> },
    { name: 'Git Flow', icon: <GitflowIcon /> },
  ];
  
  const features = [
    {
      icon: <WhiteboardIcon className="w-full h-full" />,
      title: 'Freeform Whiteboard',
      description: "Our core is a dynamic, infinite whiteboard where you can drop notes, embed images, sketch diagrams, and connect concepts freely. It's the perfect canvas for visual brainstorming, mind-mapping, and immersive studying sessions without creative limits.",
    },
    {
      icon: <MemoryIcon className="w-full h-full" />,
      title: 'AI Memory Customize',
      description: "Tailor your AI tutor’s memory to focus on specific subjects or projects. Teach it to remember key concepts from your sessions, creating a personalized knowledge base that provides more relevant, contextual assistance over time.",
    },
    {
      icon: <UIIcon className="w-full h-full" />,
      title: 'Your Choice of UI',
      description: "Personalize your learning environment to match your style. Choose from various themes, fonts, and layouts to create a workspace that minimizes distractions, enhances readability, and maximizes your focus and productivity.",
    },
     {
      icon: <ChatIcon className="w-full h-full" />,
      title: 'Interactive AI Chat',
      description: "Engage in natural conversations with your AI tutor. Ask complex questions, get step-by-step explanations, and receive instant feedback on your ideas, 24/7. It's like having a personal expert always by your side.",
    },
    {
      icon: <ProgressIcon className="w-full h-full" />,
      title: 'Smart Progress Tracking',
      description: "Visualize your learning journey with intelligent analytics. Track your mastery of topics, identify areas for improvement, and set personalized goals to stay motivated and on the path to success.",
    },
    {
      icon: <CollaborationIcon className="w-full h-full" />,
      title: 'Collaborative Spaces',
      description: "Learning is better together. Invite friends or classmates to a shared whiteboard, brainstorm in real-time, and tackle complex problems as a team. H2NQ syncs everything seamlessly for all collaborators.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-sans">
      <Header
        onHomeClick={() => scrollToSection(homeRef)}
        onIntroClick={() => scrollToSection(introRef)}
        onFeatureClick={() => scrollToSection(featureRef)}
        onAboutClick={() => scrollToSection(aboutRef)}
        onTechClick={() => scrollToSection(techRef)}
      />

      <main>
        {/* Hero Section */}
        <section ref={homeRef} id="home" className="relative h-screen flex items-center justify-center text-center overflow-hidden px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50 to-white dark:from-slate-900 dark:via-[#379eff]/10 dark:to-slate-900"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(55,158,255,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(55,158,255,0.15),rgba(255,255,255,0))]"></div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Reimagine Learning with <span className="text-[#379eff]">H2NQ</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8">
              Your personal AI tutor and infinite whiteboard. Designed for students, thinkers, and creators who want to learn without limits.
            </p>
            <div className="flex justify-center items-center gap-4">
               <button
                onClick={() => scrollToSection(featureRef)}
                className="bg-[#379eff] text-white font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                Get Started
              </button>
               <button
                className="bg-transparent text-[#379eff] border border-[#379eff] font-semibold px-8 py-3 rounded-lg hover:bg-[#379eff] hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Log In
              </button>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section ref={introRef} id="intro" className="py-20 md:py-32 px-4 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <p className="text-sm font-bold uppercase tracking-widest text-[#379eff] mb-2">The H2NQ Method</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Your Personal AI Learning Companion</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                H2NQ is more than just a tool; it's your dedicated partner in education. We've designed a platform where AI acts as a personal tutor, adapting to your learning style. Whether you're a student tackling complex subjects or a lifelong learner exploring new ideas, H2NQ provides a supportive and interactive environment to help you succeed.
              </p>
            </div>
            <div className="flex justify-center items-center">
              <BrainCircuitIcon />
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section ref={featureRef} id="feature" className="pt-20 md:pt-32">
          <div className="max-w-6xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Core Features of <span className="text-[#379eff]">H2NQ</span></h2>
            <p className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-12">
                Everything you need for a revolutionary learning experience, all in one place.
            </p>
          </div>
          
          <div className="overflow-hidden">
            {features.map((feature, index) => (
              <div key={index} className={`py-20 md:py-24 px-4 ${index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                  <div className={`flex justify-center items-center ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                    <div className="relative w-56 h-56 sm:w-64 sm:h-64 group">
                       <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl transform -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105"></div>
                       <div className="relative flex items-center justify-center w-full h-full text-[#379eff] bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-10 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                           {feature.icon}
                       </div>
                   </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Us Section */}
        <section ref={aboutRef} id="about" className="py-20 md:py-32 px-4 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12">The Minds Behind H2NQ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-[#379eff]/20 hover:-translate-y-2 transition-all duration-300">
                  <div className="flex items-center justify-center mb-4 w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#379eff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-[#379eff]">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section ref={techRef} id="tech" className="py-20 md:py-32 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12">Built With Modern Technology</h2>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
              {technologies.map((tech, index) => (
                <div key={index} className="flex flex-col items-center gap-3 group">
                  <div className="w-16 h-16 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
                    {tech.icon}
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer
        onHomeClick={() => scrollToSection(homeRef)}
        onIntroClick={() => scrollToSection(introRef)}
        onFeatureClick={() => scrollToSection(featureRef)}
        onAboutClick={() => scrollToSection(aboutRef)}
        onTechClick={() => scrollToSection(techRef)}
      />
    </div>
  );
};

export default App;