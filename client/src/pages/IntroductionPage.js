// Happy coding :D
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroHeader from '../components/IntroHeader';
import IntroFooter from '../components/IntroFooter';
import MongoDbIcon from '../components/icons/intro/MongoDbIcon';
import VercelIcon from '../components/icons/intro/VercelIcon';
import GithubIcon from '../components/icons/intro/GithubIcon';
import GitflowIcon from '../components/icons/intro/GitflowIcon';
import BrainCircuitIcon from '../components/icons/intro/BrainCircuitIcon';
// import WhiteboardIcon from '../components/icons/intro/WhiteboardIcon';
import MemoryIcon from '../components/icons/intro/MemoryIcon';
import UIIcon from '../components/icons/intro/UIIcon';
import ChatIcon from '../components/icons/intro/ChatIcon';
import ProgressIcon from '../components/icons/intro/ProgressIcon';
import CollaborationIcon from '../components/icons/intro/CollaborationIcon';
import LinkedInIcon from '../components/icons/intro/LinkedInIcon';
import Modal from '../components/Modal';
import GeminiCLIAvatar from '../components/GeminiCLI.png';

const IntroductionPage = () => {
  const homeRef = useRef(null);
  const introRef = useRef(null);
  const featureRef = useRef(null);
  const aboutRef = useRef(null);
  const techRef = useRef(null);
  const navigate = useNavigate();

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        }
    }
    return 'light';
  });

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

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false;
    }
  };

  const team = [
    {
      name: 'Vu Trong Hiep',
      role: 'Main full-stack coder',
      avatar: 'https://cdn.discordapp.com/avatars/874266937507577886/33aab699ee14519bc9e834cb9e5265bb.webp',
      bio: 'Hiep is the lead full-stack developer, responsible for the core architecture and implementation of H2NQ. He specializes in MERN stack development and ensures the seamless integration of front-end and back-end systems.',
      github: 'https://github.com/vthiep2412',
      linkedin: 'No linkedin yet.'
    },
    {
      name: 'Le Tam Nhu',
      role: 'Designer Logo UI/UX',
      avatar: 'https://cdn.discordapp.com/avatars/865185598591598602/990424e2b2322ddd52e008da460ef4b8.webp',
      bio: 'Nhu is the creative mind behind H2NQ\'s visual identity. She designed the logo and crafted the user-friendly UI/UX, focusing on an intuitive and engaging learning experience.',
      github: 'https://github.com/LynaAkuma',
      linkedin: 'No linkedin yet.'
    },
    {
      name: 'Nguyen Lam Quynh',
      role: 'Designer Logo UI/UX',
      avatar: 'https://cdn.discordapp.com/avatars/1300406449570185300/1e9fba16884ee9e682652533d0d35916.webp',
      bio: 'Quynh collaborated on the UI/UX design with Nhu, contributing to the aesthetic and functional aspects of the platform. Her work ensures a consistent and appealing user interface across H2NQ.',
      github: 'https://github.com/quynhruby032203-oss',
      linkedin: 'No linkedin yet.'
    },
    {
      name: 'Tran Duc Huy',
      role: 'Slide maker',
      avatar: 'https://cdn.discordapp.com/avatars/1127549551482523659/9f0d850d529b8df0612aefab86f3addd.webp',
      bio: 'Huy is responsible for creating compelling presentations and slides that effectively communicate H2NQ\'s vision and features. His attention to detail helps showcase the project\'s value.',
      github: 'https://github.com/Yk-Yui',
      linkedin: 'No linkedin yet.'
    },
    {
      name: 'Gemini Cli',
      role: 'Codebase support',
      avatar: GeminiCLIAvatar,
      bio: 'Gemini Cli provides artificial intelligent assistance and support for the H2NQ codebase, helping with development, debugging, and maintenance tasks, an great Autonomous AI.',
      github: 'https://github.com/google-gemini/gemini-cli',
      linkedin: 'He doesn\'t have a linkedin yet :O',
      avatarClassName: 'w-full h-full rounded-full object-contain', // Custom class for Gemini Cli avatar in card
      modalAvatarClassName: 'w-full h-auto rounded-2xl object-contain' // Custom class for Gemini Cli avatar in modal
    },
  ];

  const technologies = [
    { name: 'MongoDB Atlas', icon: <MongoDbIcon /> },
    { name: 'Vercel', icon: <VercelIcon /> },
    { name: 'GitHub', icon: <GithubIcon /> },
    { name: 'Git Flow', icon: <GitflowIcon /> },
  ];
  
  const features = [
    // Commented out Freeform Whiteboard feature
    // {
    //   icon: <WhiteboardIcon className="w-full h-full" />,
    //   title: 'Freeform Whiteboard',
    //   description: "Our core is a dynamic, infinite whiteboard where you can drop notes, embed images, sketch diagrams, and connect concepts freely. It's the perfect canvas for visual brainstorming, mind-mapping, and immersive studying sessions without creative limits.",
    // },
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

  const openMemberModal = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const closeMemberModal = () => {
    setShowMemberModal(false);
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-sans">
      <IntroHeader
        onHomeClick={() => scrollToSection(homeRef)}
        onIntroClick={() => scrollToSection(introRef)}
        onFeatureClick={() => scrollToSection(featureRef)}
        onAboutClick={() => scrollToSection(aboutRef)}
        onTechClick={() => scrollToSection(techRef)}
        theme={theme}
        toggleTheme={toggleTheme}
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
                onClick={() => navigate('/auth', { state: { formType: 'login' } })}
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
                <div key={index} className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-lg hover:shadow-[#379eff]/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  onClick={() => openMemberModal(member)}>
                  <div className="flex items-center justify-center mb-4 w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto">
                     <img src={member.avatar} alt={member.name} className={`w-full h-full rounded-full ${member.name === 'Gemini Cli' ? 'object-contain' : 'object-cover'}`} />
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

        {/* Call to Action Section */}
        <section className="py-20 md:py-32 px-4 bg-white dark:bg-slate-900 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Ready to Reimagine Learning?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Join H2NQ today and unlock your full learning potential. Sign up now to get started!
            </p>
            <button
              onClick={() => navigate('/auth', { state: { formType: 'signup' } })}
              className="bg-[#379eff] text-white font-semibold px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </section>
      </main>

      <IntroFooter
        onHomeClick={() => scrollToSection(homeRef)}
        onIntroClick={() => scrollToSection(introRef)}
        onFeatureClick={() => scrollToSection(featureRef)}
        onAboutClick={() => scrollToSection(aboutRef)}
        onTechClick={() => scrollToSection(techRef)}
      />

      {selectedMember && (
        <Modal show={showMemberModal} onClose={closeMemberModal} theme={theme}>
          <div className="flex flex-col items-center p-4 text-center">
            <img src={selectedMember.avatar} alt={selectedMember.name} className={selectedMember.modalAvatarClassName || "w-32 h-32 rounded-full object-cover shadow-lg mb-4"} />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{selectedMember.name}</h3>
            <p className="text-lg text-[#379eff] mb-2">{selectedMember.role}</p>
            <p className="text-base text-slate-600 dark:text-slate-400 mb-4">{selectedMember.bio}</p>
            <div className="flex space-x-4">
              {isValidUrl(selectedMember.github) ? (
                <a href={selectedMember.github} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-300 hover:text-[#379eff] transition-colors">
                  <GithubIcon className="w-6 h-6" />
                </a>
              ) : (
                <span className="text-slate-600 dark:text-slate-400">GitHub: {selectedMember.github}</span>
              )}
              {isValidUrl(selectedMember.linkedin) ? (
                <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-300 hover:text-[#379eff] transition-colors">
                  <LinkedInIcon className="w-6 h-6" />
                </a>
              ) : (
                <span className="text-slate-600 dark:text-slate-400">{selectedMember.linkedin}</span>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default IntroductionPage;