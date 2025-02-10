import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Determine which section is in view
      const sections = ["home", "about", "projects", "contact"];
      let currentSection = "home";

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    // Adjust offset based on section
    const offset =
      sectionId === "about" ? 0 : sectionId === "projects" ? 80 : 100;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg dark:shadow-gray-900/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("home")}
              className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent py-1 leading-normal"
            >
              Justin Kyuhyung Lee
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "About", "Projects", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors px-3 py-2 text-sm font-medium relative group
                  ${
                    activeSection === item.toLowerCase()
                      ? "text-purple-600 dark:text-purple-400"
                      : ""
                  }`}
              >
                {item}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 transform transition-transform
                  ${
                    activeSection === item.toLowerCase()
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
          >
            <div className="relative w-6 h-6">
              <motion.div
                initial={false}
                animate={{
                  scale: isDark ? 1 : 0,
                  opacity: isDark ? 1 : 0,
                  rotate: isDark ? 0 : 180,
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Moon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <motion.div
                initial={false}
                animate={{
                  scale: isDark ? 0 : 1,
                  opacity: isDark ? 0 : 1,
                  rotate: isDark ? -180 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Sun className="w-6 h-6 text-yellow-500" />
              </motion.div>
            </div>
          </motion.button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none"
            >
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 top-3" : "top-1"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "top-3"
                  }`}
                />
                <span
                  className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 top-3" : "top-5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-56 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {["Home", "About", "Projects", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors
                  ${
                    activeSection === item.toLowerCase()
                      ? "text-purple-600 dark:text-purple-400 bg-gray-50 dark:bg-gray-800"
                      : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
