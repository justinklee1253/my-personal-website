"use client";

import React, { useState, useEffect } from "react";
import { FileText, Linkedin, Github, MousePointer } from "lucide-react";
import profileImage from "../images/profile.jpg";
import { motion } from "framer-motion";
import gridPattern from "../assets/grid.svg";
import bostonCollegeLogo from "../images/bostoncollege.png";

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
      className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pt-24 pb-8 relative overflow-hidden bg-white dark:bg-dark-bg transition-colors duration-300"
    >
      {/* Dark mode background effects */}
      <div className="absolute inset-0 -z-10 dark:bg-dark-gradient opacity-0 dark:opacity-100 transition-opacity duration-300">
        <div
          className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
          style={{ backgroundImage: `url(${gridPattern})` }}
        ></div>
      </div>

      {/* Existing animated background elements - visible only in light mode */}
      <div className="absolute inset-0 -z-10 dark:opacity-0 transition-opacity duration-300">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Dark mode floating particles - visible only in dark mode */}
      <div className="absolute inset-0 -z-10 opacity-0 dark:opacity-20 transition-opacity duration-300">
        {/* Add some subtle star-like particles */}
        <div className="stars"></div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 mb-8">
        {/* Image Section - Add hover and click interactions */}
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl relative">
            <img
              src={profileImage || "/placeholder.svg"}
              alt="Justin's Profile"
              className="w-full h-full object-cover transform transition-transform duration-500"
            />
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="flex flex-col space-y-8 md:ml-8 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 leading-tight">
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

          <motion.div
            className="space-y-4 text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="font-semibold text-gray-800 dark:text-white">
                School:
              </span>
              <motion.div
                className="group relative bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full hover:bg-transparent transition-colors duration-300 flex items-center gap-2 cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C5972D]/10 to-[#98002E]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                <img
                  src={bostonCollegeLogo}
                  alt="Boston College Logo"
                  className="w-5 h-5 object-contain relative z-10"
                />
                <span className="flex items-center gap-1 relative z-10">
                  <motion.span
                    className="hover:text-[#C5972D] transition-colors duration-300"
                    whileHover={{ y: -1 }}
                  >
                    Boston
                  </motion.span>
                  <motion.span
                    className="hover:text-[#98002E] transition-colors duration-300"
                    whileHover={{ y: -1 }}
                  >
                    College
                  </motion.span>
                </span>
              </motion.div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="font-semibold text-gray-800 dark:text-white">
                Major:
              </span>
              <span className="bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                Computer Science
              </span>
            </div>

            <motion.p
              className="max-w-2xl leading-relaxed relative group cursor-default"
              whileHover={{ scale: 1.02 }}
            >
              As a recent graduate from Boston College (Spring 2025) with 2+
              years of experience building out REST APIs, and building
              full-stack AI integrated applications, I'm currently seeking
              opportunities in Full-Stack/Backend Software Engineering and AI/ML
              roles.
              <span className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MousePointer className="w-4 h-4 text-purple-500" />
              </span>
            </motion.p>
          </motion.div>

          {/* Social Links - Enhanced hover effects */}
          <motion.div
            className="flex items-center justify-center md:justify-start space-x-6 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="/resumecv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2"
              aria-label="Download Resume"
            >
              <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <FileText className="w-8 h-8 text-gray-700 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 relative z-10 transition-colors duration-300" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="https://www.linkedin.com/in/justinklee1253/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2"
              aria-label="LinkedIn Profile"
            >
              <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <Linkedin className="w-8 h-8 text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 relative z-10 transition-colors duration-300" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href="https://github.com/justinklee1253"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2"
              aria-label="GitHub Profile"
            >
              <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <Github className="w-8 h-8 text-gray-700 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 relative z-10 transition-colors duration-300" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
