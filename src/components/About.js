import React, { useState, useRef, useLayoutEffect } from "react";
import { Briefcase, MapPin, Code2, Database, ExternalLink } from "lucide-react";
import profileImage from "../images/profile2.jpg";
import { motion, useInView } from "framer-motion";

const About = () => {
  const timelineRef = useRef(null);
  const isTimelineInView = useInView(timelineRef, { once: true, amount: 0.2 });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [dotTop, setDotTop] = useState(0);
  const itemRefs = useRef([]);

  useLayoutEffect(() => {
    if (!timelineRef.current || itemRefs.current.length === 0) return;
    const idx = hoveredItem !== null ? hoveredItem : 0;
    const containerRect = timelineRef.current.getBoundingClientRect();
    const itemRect = itemRefs.current[idx]?.getBoundingClientRect();
    if (itemRect && containerRect) {
      setDotTop(itemRect.top - containerRect.top + itemRect.height / 2 - 10); // 10 = dot radius
    }
  }, [hoveredItem, isTimelineInView]);

  const experiences = [
    {
      company: "Content Academy",
      title: "Lead Software Engineer",
      date: "December 2024 - May 2024",
      location: "Boston, MA",
      details: [
        "Led a team of 4 engineers and designers to architect and deploy a scalable full-stack SaaS platform using React, Node.js, Redis, and PostgreSQL, supporting 500+ active users and integrating third-party APIs for personalized video content and user analytics.",
        "Increased user retention by 20% through iterative feature rollouts, including a gamified mission and reward system, a ranking algorithm based on Instagram metrics, and a Discord-integrated leaderboard for community engagement.",
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
        "Developed functionality for team itinerary PDF generation within an existing feature in the backend API using Python and Flask, enabling the scheduling of 1,000+ multi-team trips for sports organizations.",
        "Spearheaded development of new feature for over 6,300+ sports teams within the backend API in collaboration with the Engineering Strike Team, using Python, Flask GraphQL, applying Agile development practices to ensure high code quality",
        "Wrote unit and snapshot tests following Test-Driven Development(TDD) principles, increasing code coverage by 10% and improving system reliability and scalability.",
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
        "Improved logistics accuracy by 10% through spearheading the development of a shipment validation tool using Python, Flask, SQLite, and the Google Maps Address Validation API, improving logistics accuracy by 30% and reducing processing times for shipment data.",
        "Developed Python scripts integrating LG's MSSQL database with Airtable, automating data synchronization, and improving data accessibility for 50+ sales representatives.",
      ],
      color: "purple",
      icon: <Database className="w-5 h-5" />,
    },
  ];

  return (
    <section
      id="about"
      className="min-h-screen w-full py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center"
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
                I recently graduated from BC (Spring 2025) with a B.A in
                Computer Science, and I specialize in full-stack development
                with a focus on building secure and fast backend REST APIs,
                integrating 3rd party APIs and solving problems through my code.
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
            />

            {/* Moving timeline dot */}
            <motion.div
              className="absolute left-[-10px] w-5 h-5 rounded-full border-4 border-indigo-500 bg-indigo-500 z-20"
              animate={{ top: dotTop }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {/* Timeline items */}
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.company}
                  className="relative"
                  ref={(el) => (itemRefs.current[index] = el)}
                  initial={{ opacity: 0, x: -50 }}
                  animate={isTimelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
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
