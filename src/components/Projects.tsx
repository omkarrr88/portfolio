import { Car, Camera, Activity, Film, Github, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const projects = [
    {
      icon: Car,
      title: 'Vehicle-to-Vehicle Communication System (Ongoing)',
      description: 'Currently developing a simulation-based system for accident prevention and blind turn safety through V2V communication. Implementing communication protocols, sensor data processing, and real-time alert mechanisms to enhance road safety on accident-prone highways.',
      technologies: ['Python', 'Simulation', 'Networking', 'IoT'],
      color: 'from-teal-600 to-amber-600',
      githubLink: 'https://github.com/omkarrr88/V2V',
      details: 'Accidents regularly occur on blind highway turns where drivers lack direct line of sight. This project creates a real-time localized communication grid that calculates the collision vectors of nearby vehicles and alerts drivers before they can visually see the danger.',
      architecture: '1. **Data Acquisition Grid**: IoT simulated sensors pushing coordinate updates.\n2. **V2V Broker**: UDP/TCP localized mesh network.\n3. **Analytics Engine**: Python scripts running predictive kinematic physics.',
      challenges: '- Achieving ultra-low latency within the simulation node networking.\n- Handling simultaneous data streams from multiple vehicles accurately.',
    },
    {
      icon: Camera,
      title: 'Face Recognition Attendance System (May 2025)',
      description: 'Implemented an intelligent attendance system using facial recognition to automate daily tracking. Utilized OpenCV and face-recognition libraries for real-time image processing and recognition. Integrated with backend database for secure storage and automated attendance reports.',
      technologies: ['Python', 'OpenCV', 'Computer Vision', 'Database'],
      color: 'from-green-600 to-emerald-600',
      githubLink: 'https://github.com/omkarrr88/face-recognition-attendance-system',
      details: 'Manual attendance taking in university limits lecturing time and frequently leads to proxy-marking. This system acts as a smart watcher that automatically captures, processes, categorizes, and logs attendance via the classroom IP camera.',
      architecture: '1. **Video Ingestion**: OpenCV camera stream binding.\n2. **Face Extraction**: Haarcascades and generic bounding box recognition.\n3. **Vector Matching**: Validating cropped faces against stored embeddings.\n4. **Data Layer**: Logging timestamp and ID into secure MySQL tables.',
      challenges: '- Tuning recognition thresholds to minimize false positives.\n- Properly storing and compressing facial embeddings in MySQL to avoid ballooning sizes.',
    },
    {
      icon: Activity,
      title: 'Fitness Tracker Application (Nov 2024)',
      description: 'Built a responsive fitness tracking web platform featuring BMI calculator, user fitness goals, and lifestyle data logging. Integrated analytics for personalized insights and progress monitoring. Designed for scalability.',
      technologies: ['Web Dev', 'JavaScript', 'Responsive Design', 'Analytics'],
      color: 'from-orange-600 to-red-600',
      githubLink: 'https://github.com/omkarrr88/Fitness-Tracker',
      details: 'Creating habits is hard without visualizing progression. This comprehensive web platform tracks health metrics mathematically and offers dynamic charting to keep users motivated day over day.',
      architecture: '1. **Frontend Canvas**: JavaScript DOM manipulation and Chart.js integration.\n2. **State Management**: LocalStorage/IndexedDB for persistent lightweight data.\n3. **Engines**: Real-time BMI and TDEE calculation logic.',
      challenges: '- Building a flawlessly responsive mobile view for the graphs.\n- Preventing data corruption when syncing between sessions.'
    },
    {
      icon: Film,
      title: 'Movie Recommendation System (May 2024)',
      description: 'Engineered a full-stack web application for personalized movie recommendations using collaborative filtering. Integrated IMDB/TMDB APIs and implemented sentiment analysis of user reviews with NLTK.',
      technologies: ['NLTK', 'APIs', 'Python', 'Machine Learning', 'Full Stack'],
      color: 'from-cyan-600 to-blue-600',
      githubLink: 'https://github.com/omkarrr88/movie-recommendation-system',
      details: 'Finding the right movie among millions of titles is difficult. This collaborative filtering and sentiment-analysis hybrid system accurately suggests highly-rated and topically-relevant films based on a user’s historical preferences.',
      architecture: '1. **Frontend**: React-based responsive UI.\n2. **Backend**: Python Flask/FastAPI REST layer.\n3. **ML Engine**: Scikit-learn for matrix factorization and NLTK pipeline for parsing IMDB review sentiment.\n4. **Database**: PostgreSQL for user preference tracking.',
      challenges: '- Integrating multiple external APIs and handling rate limits.\n- Optimizing the sentiment analysis pipeline to respond in real-time without latency.\n- Normalizing sparse matrix data for accurate collaborative filtering predictions.'
    },
  ];

  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <section id="projects" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
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
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-amber-600 dark:hover:text-amber-400 font-semibold text-sm transition-colors uppercase tracking-wider"
                >
                  <ExternalLink size={16} />
                  View Case Study
                </button>
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium text-sm transition-colors ml-auto"
                >
                  <Github size={16} />
                  Code
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </section>
  );
}
