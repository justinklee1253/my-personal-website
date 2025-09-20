import React from "react";
import { Github, ExternalLink, Code2 } from "lucide-react";

import project1Image from "../images/contentacademyimg.png";
import project2Image from "../images/resolved.png";
import project3Image from "../images/polaritydash.png";

const projects = [
  {
    title: "Content Academy",
    description:
      "Content Academy is a gamified all-in-one platform that helps content creators scale their personal brands by managing, scheduling, and analyzing their content. With over 750+ active users, the platform syncs real-time performance data via the Instagram API and turns the content creation journey into a more engaging experience through missions, rewards, and a leaderboard system.",
    imageUrl: project1Image,
    techStack: ["React", "Node.js", "Redis", "Tailwind CSS", "Typescript"],
    githubLink: "https://github.com/justinklee1253/ca-3.0-frontend",
    liveLink: "https://app.contentacademy.io/",
    category: "Full Stack",
  },
  {
    title: "Polarity",
    description:
      "Polarity is an AI-powered financial assistant that helps college students curb impulsive spending in high-risk areas like sports betting, gambling, and eating out. Polarity syncs bank transactions through Plaid API integration, analyzes spending patterns, and leverages AI trained with context from your bank data to answer questions about budgeting, expenses, and financial goals.",
    imageUrl: project3Image, // Replace with your project image
    techStack: [
      "Python",
      "Flask",
      "Javascript",
      "React.js",
      "Neondb",
      "Langchain",
    ],
    githubLink: "https://github.com/justinklee1253/Polarity",
    category: "Full Stack",
  },
  {
    title: "Resolve",
    description:
      "Resolve is a multi-modal complaint analysis system that processes and categorizes customer complaints across audio, text, image, and video formats. Deployed using Docker, Resolve leverages OpenAI Whisper for speech-to-text and Google Cloud Video Intelligence for image and video analysis—extracting insights from unstructured support data to help companies streamline issue resolution.",
    imageUrl: project2Image, // Replace with your project image
    techStack: [
      "React",
      "Flask",
      "Google Cloud Console",
      "Docker",
      "RAG Pipeline",
      "Pinecone",
    ],
    githubLink: "https://github.com/nickyim/Resolved--Spend-Ruby-Hackathon-",
    category: "Full Stack",
  },
];

const ProjectCard = ({ project }) => (
  <div className="group relative bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 flex flex-col transform hover:-translate-y-2">
    {/* Project Image */}
    <div className="relative overflow-hidden h-48">
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>

    {/* Content */}
    <div className="p-6 flex flex-col flex-grow backdrop-blur-sm">
      {/* Category Tag */}
      <span className="inline-block px-3 py-1 text-sm font-medium bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-purple-800 dark:text-purple-200 rounded-full mb-3 self-start">
        {project.category}
      </span>

      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-purple-600 transition-colors duration-300">
        {project.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-4 mt-auto">
        <a
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
        >
          <Github className="w-5 h-5" />
          <span>Code</span>
        </a>
        {project.liveLink && (
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Live Demo</span>
          </a>
        )}
      </div>
    </div>
  </div>
);

const Projects = () => {
  return (
    <section
      id="projects"
      className="min-h-screen w-full py-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <h2 className="text-4xl font-bold text-center text-[#312E81] dark:text-indigo-400 mb-12">
          Projects
        </h2>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        {/* GitHub Link */}
        <div className="text-center mt-12">
          <a
            href="https://github.com/justinklee1253"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
          >
            <Code2 className="w-5 h-5" />
            <span>View more projects on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
