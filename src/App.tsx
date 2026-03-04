import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Experience from './components/Experience';
import Extracurriculars from './components/Extracurriculars';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'education', 'skills', 'projects', 'certifications', 'experience', 'extracurriculars', 'contact'];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Toaster position="bottom-right" toastOptions={{ duration: 4000, className: 'dark:bg-slate-800 dark:text-white' }} />
      <Preloader />

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-amber-500 origin-left z-50 rounded-full"
        style={{ scaleX: scrollYProgress }}
      />

      <Header activeSection={activeSection} />
      <Hero />
      <About />
      <Education />
      <Skills />
      <Projects />
      <Certifications />
      <Experience />
      <Extracurriculars />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
