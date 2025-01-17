import React from 'react';
import { Github, ExternalLink, Code2 } from 'lucide-react';

import project1Image from '../images/resolved.png';
import project2Image from '../images/datavisassist.png';
import project3Image from '../images/moimsushi.png';


const projects = [
  {
    title: "Resolved",
    description: "Developed a multi-modal complaint analysis system to process & categorize a company's customer complaints across various formats, including audio, text, image, and video files. Deployed using Docker",
    imageUrl: project1Image, // Replace with your project image
    techStack: ["React", "Flask", "Google Cloud Console", "Docker", "RAG Pipeline"],
    githubLink: "https://github.com/nickyim/Resolved--Spend-Ruby-Hackathon-",
    category: "Full Stack"
  },
  {
    title: "AI Data Visualization Assistant",
    description: "Building an AI Data Visualization Assistant that can analyze .csv files to answer questions about the data and generate graphs/charts.",
    imageUrl: project2Image,
    techStack: ["Python", "React", "FastAPI", "Tailwind CSS"],
    liveLink: "https://justinklee1253.github.io/chatbotclient/",
    githubLink: "https://github.com/justinklee1253/assignment1humanai",
    category: "Full Stack"
  },

  {
    title: "Mo-Im Sushi Website",
    description: "Built my uncle's new sushi restaurant a website using basic HTML CSS and Vanilla Javascript",
    imageUrl: project3Image, // Replace with your project image
    techStack: ["HTML", "CSS", "Javascript"],
    liveLink: "https://mo-imsushi.netlify.app/",
    githubLink: "https://github.com/justinklee1253/moimsushi",
    category: "Frontend"
  },
  
];

const ProjectCard = ({ project }) => (
  <div className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
    {/* Project Image */}
    <div className="relative overflow-hidden h-48">
      <img 
        src={project.imageUrl} 
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    {/* Content */}
    <div className="p-6 flex flex-col flex-grow">
      {/* Category Tag */}
      <span className="inline-block px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full mb-3 self-start">
        {project.category}
      </span>

      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
        {project.title}
      </h3>

      <p className="text-gray-600 mb-4 flex-grow">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-md"
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
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
        >
          <Github className="w-5 h-5" />
          <span>Code</span>
        </a>
        <a
          href={project.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Live Demo</span>
        </a>
      </div>
    </div>
  </div>
);

const Projects = () => {
  return (
    <div id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <h2 className="text-4xl font-bold text-center text-[#312E81] mb-4">
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
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
          >
            <Code2 className="w-5 h-5" />
            <span>View more projects on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Projects;