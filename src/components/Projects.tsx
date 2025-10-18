import { Car, Camera, Activity, Film, ShoppingCart, ExternalLink, Github } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      icon: Car,
      title: 'Vehicle-to-Vehicle Communication System',
      description: 'Real-time simulation-based V2V communication system for accident prevention and traffic management. Implemented using Python and SUMO simulator to enable vehicles to share critical information.',
      technologies: ['Python', 'SUMO', 'Networking', 'IoT'],
      color: 'from-teal-600 to-amber-600',
    },
    {
      icon: Camera,
      title: 'Face Recognition Attendance System',
      description: 'Automated attendance tracking system using facial recognition technology. Built with Python and OpenCV to streamline attendance management and eliminate manual processes.',
      technologies: ['Python', 'OpenCV', 'Computer Vision', 'ML'],
      color: 'from-green-600 to-emerald-600',
    },
    {
      icon: Activity,
      title: 'Fitness Tracker Application',
      description: 'Comprehensive web platform for tracking fitness activities and analyzing health metrics. Provides users with insights into their workout routines and progress over time.',
      technologies: ['Flask', 'Django', 'Python', 'JavaScript', 'MySQL'],
      color: 'from-orange-600 to-red-600',
    },
    {
      icon: Film,
      title: 'Movie Recommendation System',
      description: 'Personalized movie recommendation engine that analyzes user sentiment and viewing patterns. Leverages machine learning algorithms to provide tailored movie suggestions.',
      technologies: ['Flask', 'Scikit-learn', 'NLP', 'Python', 'ML'],
      color: 'from-cyan-600 to-blue-600',
    },
    {
      icon: ShoppingCart,
      title: 'Supermarket Billing System',
      description: 'Desktop application for automated billing and inventory management in supermarkets. Streamlines the checkout process and maintains real-time inventory tracking.',
      technologies: ['Java', 'Swing', 'MySQL', 'Desktop App'],
      color: 'from-slate-600 to-slate-800',
    },
  ];

  return (
    <section id="projects" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 group hover:scale-105 flex flex-col"
            >
              <div className={`inline-flex p-4 bg-gradient-to-br ${project.color} rounded-lg text-white mb-4 group-hover:scale-110 transition-transform self-start`}>
                <project.icon size={32} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {project.title}
              </h3>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex items-center gap-2 text-teal-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  <Github size={16} />
                  Code
                </button>
                <button className="flex items-center gap-2 text-teal-600 hover:text-blue-700 font-medium text-sm transition-colors">
                  <ExternalLink size={16} />
                  Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
