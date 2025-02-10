import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import profileImage from "../images/profile2.jpg";
import { motion, AnimatePresence } from "framer-motion";

const About = () => {
  const [selectedExperience, setSelectedExperience] =
    useState("Content Academy");

  const experiences = {
    "Content Academy": {
      title: "Chief Technology Officer @ Content Academy",
      date: "December 2024 - Present",
      details: [
        "Leading a team of 4 engineers and designers to develop a full-stack SaaS to deliver users a responsive dashboard with Instagram & Discord API Integrations for displaying relevant user statistics, video modules, an AI chatbot for personalized content scripts, and a leaderboard system for over 550+ users",
        "Collaborating with stakeholders to align product development with client needs for iterative feature rollout, increasing user retention by 20%",
      ],
    },
    Teamworks: {
      title: "Software Engineering Intern @ Teamworks",
      date: "Summer 2024",
      details: [
        "Built out new feature within the travel module of Teamworks Backend API to support multi-team trips and wrote documentation for clarity.",
        "Developed new Facility Management feature with the Engineering Strike Team: following SDLC practices, applied debugging principles, and wrote unit tests to ensure code quality and scalability.",
      ],
    },
    "LG Electronics": {
      title: "Software Engineering Intern @ LG Electronics",
      date: "Summer 2023",
      details: [
        "Integrated LG's MSSQL database with Airtable to enhance data accessibility and operational workflows for sales teams.",
        "Built a shipment validation tool using Python, Flask, SQLite, and Google Maps API, improving logistics accuracy and efficiency.",
      ],
    },
    "BC EagleTech": {
      title: "Information Technology Consultant @ BC EagleTech",
      date: "January 2023 - Present",
      details: [
        "Provide quality one-on-one customer support to 14,000+ Boston College students, faculty, and staff.",
        "Address, diagnose, and resolve issues regarding network connectivity, software installation, virus, hard-drive failures, operating system rebuilds, data recovery, and hardware configurations.",
      ],
    },
  };

  return (
    <section
      id="about"
      className="py-24 px-4 dark:text-gray-200 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto space-y-16">
        {/* About Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-indigo-900 dark:text-indigo-400">
              About Me
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Hello! I'm Justin, a software engineer with a passion for
                creating impactful web applications.
              </p>
              <p>
                I am set to graduate from BC in May 2025 with a B.A in Computer
                Science, and I specialize in full-stack development with a focus
                on integrating modern web technologies and frameworks into my
                software solutions.
              </p>
              <p>
                When I'm not coding, you can find me lifting weights at the gym,
                boxing and exploring the city.
              </p>
            </div>
          </div>
          <div className="max-w-[400px] w-full mx-auto aspect-[4/3] rounded-lg overflow-hidden shadow-lg dark:shadow-indigo-500/20">
            <img
              src={profileImage}
              alt="Justin's Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Experience Section */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-400">
            Experience
          </h3>

          <div className="grid md:grid-cols-[250px,1fr] gap-8">
            {/* Company Selection */}
            <div className="space-y-2">
              {Object.keys(experiences).map((company) => (
                <motion.button
                  key={company}
                  onClick={() => setSelectedExperience(company)}
                  className={`w-full text-left px-4 py-3 rounded transition-all relative
                    ${
                      selectedExperience === company
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {company}
                  {selectedExperience === company && (
                    <motion.div
                      className="absolute inset-0 bg-indigo-600 rounded z-[-1]"
                      layoutId="experienceBackground"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Experience Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedExperience}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <motion.h4
                  className="text-xl font-semibold text-gray-800 dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {experiences[selectedExperience].title}
                </motion.h4>
                <motion.p
                  className="text-gray-500 dark:text-gray-400 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {experiences[selectedExperience].date}
                </motion.p>
                <motion.ul
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {experiences[selectedExperience].details.map(
                    (detail, index) => (
                      <motion.li
                        key={index}
                        className="flex gap-3 text-gray-600 dark:text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <ChevronRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />
                        <span>{detail}</span>
                      </motion.li>
                    )
                  )}
                </motion.ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
