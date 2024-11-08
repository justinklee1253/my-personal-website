import React, { useState, useEffect } from 'react';
import { FileText, Linkedin, Github } from 'lucide-react';
import profileImage from '../images/profile.jpg';

const useTypewriter = (text, speed = 100) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeoutId);
    }
  }, [displayedText, text, speed]);

  const firstLine = displayedText.split('|')[0] || '';
  const secondLine = displayedText.split('|')[1] || '';

  return { firstLine, secondLine };
};

const Home = () => {
  const { firstLine, secondLine } = useTypewriter("Hi I'm Justin,|a Software Engineer", 100);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 opacity-70" />
      
      {/* Subtle mesh gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(163,173,235,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(190,173,235,0.3),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Image Section */}
        <div className="relative">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl transform hover:scale-105 transition-transform duration-300">
            <img 
              src={profileImage}
              alt="Justin's Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col space-y-6 md:ml-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">
            {firstLine}
            <span className="block mt-2">{secondLine}</span>
            <span className="inline-block animate-blink">|</span>
          </h1>

          <div className="space-y-3 text-lg text-gray-700">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-semibold">School:</span>
              <span>Boston College</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-semibold">Major:</span>
              <span>Computer Science</span>
            </div>
            <p className="max-w-2xl">
              I'm really passionate about building web applications with real world
              functionality, and have 2+ years of experience in the SDLC.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start space-x-6 pt-4">
            <a 
              href="/resumecv.pdf"
              target="_blank" 
              rel="noopener noreferrer"
              className="transform hover:scale-110 transition-transform duration-200"
            >
              <FileText className="w-8 h-8 text-gray-700 hover:text-purple-600" />
            </a>
            <a 
              href="https://www.linkedin.com/in/justinklee1253/"
              target="_blank" 
              rel="noopener noreferrer"
              className="transform hover:scale-110 transition-transform duration-200"
            >
              <Linkedin className="w-8 h-8 text-gray-700 hover:text-blue-600" />
            </a>
            <a 
              href="https://github.com/justinklee1253"
              target="_blank" 
              rel="noopener noreferrer"
              className="transform hover:scale-110 transition-transform duration-200"
            >
              <Github className="w-8 h-8 text-gray-700 hover:text-purple-600" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;