"use client";

import React, { useState, useEffect } from "react";
import { FileText, Linkedin, Github, MousePointer } from "lucide-react";
import profileImage from "../images/profile.jpg";
import { motion, useInView } from "framer-motion";
import gridPattern from "../assets/grid.svg";
import GitHubCalendar from "react-github-calendar";
import "../styles/github-calendar-styles.css";

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
  const calendarRef = React.useRef(null);
  const isCalendarInView = useInView(calendarRef, { once: true, amount: 0.2 });

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
              <span className="bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full hover:bg-transparent transition-colors duration-300">
                <span className="hover:text-[#C5972D]">Boston</span>{" "}
                <span className="hover:text-[#98002E]">College</span>
              </span>
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
              years of experience building out REST APIs, integrating APIs and
              building full-stack applications, I'm currently seeking Full-Stack
              or Backend Software Engineering roles.
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

      {/* GitHub Activity Section - Now positioned below main content */}
      <motion.div
        className="w-full max-w-4xl mx-auto px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={isCalendarInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
        ref={calendarRef}
      >
        <motion.h3
          className="text-xl md:text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400"
          initial={{ opacity: 0, y: 20 }}
          animate={isCalendarInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          My GitHub Activity
        </motion.h3>

        <motion.div
          className="rounded-2xl shadow-lg dark:shadow-gray-900/30 bg-white/80 dark:bg-gray-900/80 p-4 md:p-6 group cursor-pointer"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isCalendarInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            transition: "all 0.2s ease-out",
          }}
        >
          <div className="flex justify-center">
            <GitHubCalendar
              username="justinklee1253"
              blockSize={12}
              blockMargin={3}
              colorScheme={
                typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? "dark"
                  : "light"
              }
              fontSize={12}
              style={{
                width: "100%",
                maxWidth: "800px",
                color: "white",
              }}
              theme={{
                light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
                dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
              }}
              renderBlock={(block, value) => (
                <motion.rect
                  {...block.props}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isCalendarInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 0.05 * (value?.count || 0),
                  }}
                />
              )}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
