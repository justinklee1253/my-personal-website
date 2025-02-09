import React, { useState, useEffect } from "react";
import { FileText, Linkedin, Github } from "lucide-react";
import profileImage from "../images/profile.jpg";

const useTypewriter = (text, speed = 100) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (displayedText.length < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeoutId);
    } else {
      // Set typing as complete immediately
      setIsTypingComplete(true);
    }
  }, [displayedText, text, speed]);

  return { text: displayedText, isTypingComplete };
};

const Home = () => {
  const { text, isTypingComplete } = useTypewriter(
    "Hi I'm Justin,\nA Software Engineer",
    50
  );

  return (
    <div
      id="home"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Image Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl transform hover:scale-105 transition-all duration-500 relative">
            <img
              src={profileImage}
              alt="Justin's Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col space-y-8 md:ml-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 leading-tight">
            {text.split("\n").map((line, index) => (
              <div
                key={index}
                className="flex items-center justify-center md:justify-start mb-2"
              >
                {line}
                {!isTypingComplete && index === text.split("\n").length - 1 && (
                  <span className="inline-block w-[3px] h-[1em] bg-blue-600 ml-1 animate-blink"></span>
                )}
              </div>
            ))}
          </h1>

          <div className="space-y-4 text-lg text-gray-600">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="font-semibold text-gray-800">School:</span>
              <span className="bg-white/50 px-3 py-1 rounded-full">
                Boston College
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="font-semibold text-gray-800">Major:</span>
              <span className="bg-white/50 px-3 py-1 rounded-full">
                Computer Science
              </span>
            </div>
            <p className="max-w-2xl leading-relaxed">
              I'm really passionate about building web applications with real
              world functionality, and have 2+ years of experience in the SDLC.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start space-x-6 pt-4">
            <a
              href="/resumecv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2"
              aria-label="Download Resume"
            >
              <div className="absolute inset-0 bg-purple-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <FileText className="w-8 h-8 text-gray-700 group-hover:text-purple-600 relative z-10 transition-colors duration-300" />
            </a>
            <a
              href="https://www.linkedin.com/in/justinklee1253/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2"
              aria-label="LinkedIn Profile"
            >
              <div className="absolute inset-0 bg-blue-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <Linkedin className="w-8 h-8 text-gray-700 group-hover:text-blue-600 relative z-10 transition-colors duration-300" />
            </a>
            <a
              href="https://github.com/justinklee1253"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2"
              aria-label="GitHub Profile"
            >
              <div className="absolute inset-0 bg-purple-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <Github className="w-8 h-8 text-gray-700 group-hover:text-purple-600 relative z-10 transition-colors duration-300" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
