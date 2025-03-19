import React, { useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  Calendar,
  Award,
  Briefcase,
  MapPin,
  Code2,
  Database,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import profileImage from "../images/profile2.jpg";
import { motion, AnimatePresence, useInView } from "framer-motion";

const About = () => {
  const timelineRef = useRef(null);
  const isTimelineInView = useInView(timelineRef, { once: true, amount: 0.2 });
  const [hoveredItem, setHoveredItem] = useState(null);

  const experiences = [
    {
      company: "Content Academy",
      title: "Lead Software Engineer",
      date: "December 2024 - Present",
      location: "Boston, MA",
      details: [
        "Leading a team of 4 engineers and designers to develop a full-stack SaaS to deliver users a responsive dashboard with Instagram & Discord API Integrations for displaying relevant user statistics, video modules, an AI chatbot for personalized content scripts, and a leaderboard system for over 550+ users",
        "Collaborating with stakeholders to align product development with client needs for iterative feature rollout, increasing user retention by 20%",
      ],
      color: "indigo",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      company: "Teamworks",
      title: "Software Engineering Intern",
      date: "Summer 2024",
      location: "Durham, NC",
      details: [
        "Built out new feature within the travel module of Teamworks Backend API to support multi-team trips and wrote documentation for clarity.",
        "Developed new Facility Management feature with the Engineering Strike Team: following SDLC practices, applied debugging principles, and wrote unit tests to ensure code quality and scalability.",
      ],
      color: "blue",
      icon: <Code2 className="w-5 h-5" />,
    },
    {
      company: "LG Electronics",
      title: "Software Engineering Intern",
      date: "Summer 2023",
      location: "Englewood Cliffs, NJ",
      details: [
        "Integrated LG's MSSQL database with Airtable to enhance data accessibility and operational workflows for sales teams.",
        "Built a shipment validation tool using Python, Flask, SQLite, and Google Maps API, improving logistics accuracy and efficiency.",
      ],
      color: "purple",
      icon: <Database className="w-5 h-5" />,
    },
  ];

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
          <div className="max-w-[400px] w-full mx-auto aspect-[4/3] rounded-lg overflow-hidden shadow-lg dark:shadow-indigo-500/20 group">
            <img
              src={profileImage}
              alt="Justin's Profile"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Experience Timeline Section - Enhanced with Animations */}
        <div className="space-y-8" ref={timelineRef}>
          <motion.h3
            className="text-2xl font-bold text-indigo-900 dark:text-indigo-400"
            initial={{ opacity: 0, y: -20 }}
            animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Timeline
          </motion.h3>

          <div className="relative pl-8 md:pl-12 max-w-3xl mx-auto">
            {/* Timeline line with animated gradient */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-blue-500"
              initial={{ height: 0 }}
              animate={isTimelineInView ? { height: "100%" } : {}}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {/* Animated pulse effect on the line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500 animate-ping opacity-75"></div>
            </motion.div>

            {/* Timeline items */}
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.company}
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  animate={isTimelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Timeline dot with pulse effect */}
                  <motion.div
                    className={`absolute -left-[28px] w-[20px] h-[20px] rounded-full border-4 border-${experience.color}-500 bg-${experience.color}-500 flex items-center justify-center z-10`}
                    initial={{ scale: 0 }}
                    animate={isTimelineInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.2 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    {hoveredItem === index && (
                      <motion.div
                        className={`absolute w-[30px] h-[30px] rounded-full border-2 border-${experience.color}-400 opacity-70`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Content with hover effects */}
                  <motion.div
                    className={`p-5 rounded-lg transition-all duration-300 ${
                      hoveredItem === index
                        ? "bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm"
                        : "bg-transparent"
                    }`}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white">
                        {experience.company}
                      </h4>
                      <span className="hidden md:inline text-gray-400">—</span>
                      <span className="text-lg italic text-indigo-600 dark:text-indigo-400">
                        {experience.title}
                      </span>
                      <div className="md:ml-auto text-right text-gray-500 dark:text-gray-400 font-medium">
                        {experience.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3" />
                      {experience.location}
                    </div>

                    <ul className="space-y-2">
                      {experience.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          className="flex gap-2 text-gray-600 dark:text-gray-300"
                          initial={{ opacity: 0 }}
                          animate={
                            hoveredItem === index
                              ? { opacity: 1 }
                              : { opacity: 0.9 }
                          }
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                        >
                          <span
                            className={`text-${experience.color}-500 dark:text-${experience.color}-400`}
                          >
                            •
                          </span>
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Subtle indicator for more info */}
                    {hoveredItem === index && (
                      <motion.div
                        className="mt-3 text-xs text-right text-gray-400 flex items-center justify-end gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span>Experience details</span>
                        <ExternalLink className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
