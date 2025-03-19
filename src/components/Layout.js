import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Layout = ({ children }) => {
  const starsRef = useRef(null);

  useEffect(() => {
    // Set dark mode as default
    document.documentElement.classList.add("dark");
    localStorage.theme = "dark";
  }, []);

  useEffect(() => {
    const createStars = () => {
      if (!starsRef.current) return;
      const container = starsRef.current;
      container.innerHTML = "";

      // Create twinkling stars (more of them)
      for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.setProperty("--duration", `${2 + Math.random() * 4}s`);
        star.style.setProperty("--delay", `${Math.random() * 4}s`);
        star.style.width = star.style.height = `${1 + Math.random() * 3}px`; // Slightly larger
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        container.appendChild(star);
      }

      // Create more floating particles with varied sizes
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        // Longer duration for smoother movement
        particle.style.setProperty("--duration", `${15 + Math.random() * 25}s`);
        particle.style.setProperty("--delay", `${Math.random() * -30}s`); // Negative delay for immediate start
        // Wider range of movement
        particle.style.setProperty(
          "--moveX",
          `${-300 + Math.random() * 600}px`
        );
        particle.style.setProperty(
          "--moveY",
          `${-300 + Math.random() * 600}px`
        );
        // Random size for each particle
        const size = 1 + Math.random() * 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        container.appendChild(particle);
      }

      // Create more frequent shooting stars
      for (let i = 0; i < 5; i++) {
        const shootingStar = document.createElement("div");
        shootingStar.className = "shooting-star";
        shootingStar.style.setProperty("--delay", `${Math.random() * 15}s`);
        shootingStar.style.left = `${Math.random() * 100}%`;
        shootingStar.style.top = `${Math.random() * 40}%`;
        container.appendChild(shootingStar);
      }
    };

    createStars();
    window.addEventListener("resize", createStars);

    // Recreate stars periodically to ensure continuous animation
    const interval = setInterval(createStars, 20000);

    return () => {
      window.removeEventListener("resize", createStars);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:bg-dark-bg dark:bg-none transition-colors duration-300 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:bg-dark-bg -z-20" />

      {/* Animated background shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-20 w-72 h-72 bg-primary-200/30 dark:bg-primary-900/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-2/3 right-1/3 w-60 h-60 bg-blue-200/30 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            y: [0, 50, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div
        className="stars fixed inset-0 -z-10 opacity-0 dark:opacity-100 transition-opacity duration-300"
        ref={starsRef}
      ></div>

      {/* Content */}
      <div className="relative z-0">{children}</div>
    </div>
  );
};

export default Layout;
