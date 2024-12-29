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
      // Set typing as complete after a short delay
      const finalTimeout = setTimeout(() => {
        setIsTypingComplete(true);
      }, 1000); // Wait 1 second after typing before hiding cursor
      return () => clearTimeout(finalTimeout);
    }
  }, [displayedText, text, speed]);

  return { text: displayedText, isTypingComplete };
};

const Home = () => {
  const { text, isTypingComplete } = useTypewriter(
    "Hi I'm Justin, a Software Engineer",
    100
  );

  return (
    <div
      id="home"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Image Section */}
        <div className="relative">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl transform hover:scale-105 transition-transform duration-300">
            <img
              src={profileImage}
              alt="Justin's Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col space-y-6 md:ml-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#312E81]">
            <div className="flex flex-wrap items-center">
              {text}
              {!isTypingComplete && (
                <span className="inline-block w-[3px] h-[1em] bg-[#312E81] ml-1 animate-blink"></span>
              )}
            </div>
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
              className="transform hover:scale-110 transition-transform duration-200"
              aria-label="Download Resume"
            >
              <FileText className="w-8 h-8 text-gray-700 hover:text-purple-600" />
            </a>
            <a
              href="https://www.linkedin.com/in/justinklee1253/"
              target="_blank"
              rel="noopener noreferrer"
              className="transform hover:scale-110 transition-transform duration-200"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-8 h-8 text-gray-700 hover:text-blue-600" />
            </a>
            <a
              href="https://github.com/justinklee1253"
              target="_blank"
              rel="noopener noreferrer"
              className="transform hover:scale-110 transition-transform duration-200"
              aria-label="GitHub Profile"
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
