import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import profileImage from '../images/profile2.jpg';

const About = () => {
  const [selectedExperience, setSelectedExperience] = useState('LG Electronics');

  const experiences = {
    'Teamworks': {
      title: 'Software Engineering Intern @ Teamworks',
      date: 'Summer 2024',
      details: [
        'Built out new feature within the travel module of Teamworks Backend API to support multi-team trips and wrote documentation for clarity.',
        'Developed new Facility Management feature with the Engineering Strike Team: following SDLC practices, applied debugging principles, and wrote unit tests to ensure code quality and scalability.'
      ]
    },
    'LG Electronics': {
      title: 'Software Engineering Intern @ LG Electronics',
      date: 'Summer 2023',
      details: [
        'Integrated LG’s MSSQL database with Airtable to enhance data accessibility and operational workflows for sales teams.',
        'Built a shipment validation tool using Python, Flask, SQLite, and Google Maps API, improving logistics accuracy and efficiency.'
      ]
    },
    'BC EagleTech': {
      title: 'Information Technology Consultant @ BC EagleTech',
      date: 'January 2023 - Present',
      details: [
        'Provide quality one-on-one customer support to 14,000+ Boston College students, faculty, and staff.',
        'Address, diagnose, and resolve issues regarding network connectivity, software installation, virus, hard-drive failures, operating system rebuilds, data recovery, and hardware configurations.'
      ]
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#312E81] mb-8">
          About Me
        </h2>
        
        <div className="bg-white rounded-xl p-6 mb-10 shadow-lg">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr,400px] gap-8 items-center">
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                Hello! I'm Justin, a software engineer with a passion for creating impactful web applications. 
                I believe in writing clean, efficient code and building solutions that make a difference.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                With a strong foundation in computer science from Boston College and hands-on experience in software development, 
                I specialize in full-stack development with a focus on modern web technologies.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                When I'm not coding, you can find me lifting weights at the gym, boxing and exploring the city.
              </p>
            </div>
            
            <div className="relative">
              <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={profileImage}
                  alt="Justin's Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center text-[#312E81] mb-6">
          Experience
        </h3>
        
        <div className="grid md:grid-cols-[300px,1fr] gap-8 max-w-5xl mx-auto">
          <div className="space-y-2">
            {Object.keys(experiences).map((company) => (
              <button
                key={company}
                onClick={() => setSelectedExperience(company)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between group
                  ${selectedExperience === company 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-white hover:shadow-md'
                  }`}
              >
                <span className="font-medium">{company}</span>
                <ChevronRight 
                  className={`w-5 h-5 transition-transform duration-200 
                    ${selectedExperience === company ? 'rotate-90' : 'group-hover:translate-x-1'}`}
                />
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              {experiences[selectedExperience].title}
            </h4>
            <p className="text-gray-600 mb-4 italic">
              {experiences[selectedExperience].date}
            </p>
            <ul className="space-y-2">
              {experiences[selectedExperience].details.map((detail, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                  <span className="text-gray-700 ml-2">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;