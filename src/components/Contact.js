import React from 'react';
import { Mail, Linkedin, Github, MapPin } from 'lucide-react';

const ContactSection = () => {
  return (
    <div id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <h2 className="text-4xl font-bold text-center text-[#312E81] mb-4">
          Contact Me
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Feel free to reach out! I'm always open to discussing creative ideas, or new opportunities for growth and learning!
        </p>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email Card */}
          <a 
            href="mailto:justinklee1@gmail.com" 
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-4"
          >
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors duration-300">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                justinklee.dev@gmail.com
              </p>
            </div>
          </a>

          {/* Location Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
              <p className="text-gray-600">Boston, Massachusetts</p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Connect with me on
          </h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://linkedin.com/in/justinklee1253/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center"
            >
              <div className="p-3 bg-white rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
                <Linkedin className="w-6 h-6 text-blue-600" />
              </div>
              <span className="mt-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
                LinkedIn
              </span>
            </a>
            
            <a
              href="https://github.com/justinklee1253"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center"
            >
              <div className="p-3 bg-white rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
                <Github className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
              </div>
              <span className="mt-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                GitHub
              </span>
            </a>
          </div>
        </div>

        {/* Footer Message */}
        <p className="text-center text-gray-600 mt-12">
        </p>
      </div>
    </div>
  );
};

export default ContactSection;