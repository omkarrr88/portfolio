import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';
import MyImage from './20241018_140935(1).jpg';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 px-6 bg-gradient-to-br from-teal-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Text Section */}
          <div className="flex-1 space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent">
                  Omkar Kadam
                </span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full" />
            </div>

            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-medium">
              Full Stack Machine Learning Developer
            </p>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Final-year Information Technology Engineering student at Terna Engineering College, Mumbai University.
              Passionate about building innovative solutions with AI, ML, and web technologies.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:omkark2223@ternaengg.ac.in"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                <Mail size={20} />
                Get in Touch
              </a>
              <button
                onClick={() =>
                  window.open(
                    'https://drive.google.com/file/d/15-I_8nTzdLquwk4MPWa0ilm1JAqYwXyM/view?usp=sharing',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-medium hover:border-teal-600 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400 hover:shadow-lg hover:scale-105 transition-all"
              >
                <Download size={20} />
                Download Resume
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex gap-4 pt-4">
              <a
                href="https://linkedin.com/in/omkarrrr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://github.com/omkarrr88"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
              >
                <Github size={24} />
              </a>
              <a
                href="mailto:omkark2223@ternaengg.ac.in"
                className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="flex-1 flex justify-center animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full blur-3xl opacity-20 animate-pulse" />
              <div className="relative w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-teal-600 to-amber-600 rounded-full flex items-center justify-center shadow-2xl">
                <img
                  src={MyImage}
                  alt="Omkar Kadam"
                  className="w-32 h-32 md:w-48 md:h-48 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Button */}
        <button
          onClick={() => scrollToSection('about')}
          aria-label="Scroll to About Section"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ArrowDown size={32} className="text-slate-400 dark:text-slate-600" />
        </button>
      </div>
    </section>
  );
}
