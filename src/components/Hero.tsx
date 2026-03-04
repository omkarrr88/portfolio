import { ArrowDown, Github, Linkedin, Mail, Download } from 'lucide-react';
import MyImage from './omkar-kadam-developer-mumbai.jpg';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

export default function Hero() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 800], [0, 250]);
  const yImage = useTransform(scrollY, [0, 800], [0, 100]);
  const yBg = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300"
    >
      {/* Abstract Parallax Background Elements */}
      <motion.div
        style={{ y: yBg }}
        className="absolute top-20 -left-10 w-96 h-96 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollY, [0, 1000], [0, 200]) }}
        className="absolute bottom-20 -right-10 w-[30rem] h-[30rem] bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Text Section */}
          <motion.div
            style={{ y: yText, opacity }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 space-y-6 flex flex-col items-center md:items-start text-center md:text-left mt-10 md:mt-0"
          >
            <motion.div variants={itemVariants} className="space-y-2 flex flex-col items-center md:items-start">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-teal-600 to-amber-600 bg-clip-text text-transparent inline-block hover:scale-105 transition-transform cursor-default">
                  Omkar Kadam
                </span>
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full origin-left"
              />
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-200 font-medium">
              Full Stack Machine Learning Developer
            </motion.p>

            <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Final-year Information Technology Engineering student at Terna Engineering College, Mumbai University.
              Passionate about building innovative solutions with AI, ML, and web technologies.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:omkark2223@ternaengg.ac.in"
                className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 w-full sm:w-auto bg-gradient-to-r from-teal-600 to-amber-600 text-white rounded-lg font-medium shadow-lg hover:shadow-teal-500/30 transition-shadow"
              >
                <Mail size={20} />
                Get in Touch
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  window.open(
                    'https://drive.google.com/file/d/1KHNiHUPrne6YRXO7bAJZQq5sLhrCWc8O/view?usp=sharing',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
                className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-3 w-full sm:w-auto bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-medium hover:border-teal-600 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400 shadow-md transition-colors"
              >
                <Download size={20} />
                Download Resume
              </motion.button>
            </motion.div>

            {/* Social Icons */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-6 justify-center md:justify-start w-full">
              <motion.a whileHover={{ y: -5 }} href="https://linkedin.com/in/omkarrrr" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-md text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400">
                <Linkedin size={24} />
              </motion.a>
              <motion.a whileHover={{ y: -5 }} href="https://github.com/omkarrr88" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-md text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white">
                <Github size={24} />
              </motion.a>
              <motion.a whileHover={{ y: -5 }} href="mailto:omkarkadam181188@gmail.com" className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-md text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400">
                <Mail size={24} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            style={{ y: yImage, opacity }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex-1 flex justify-center animate-float relative mt-8 md:mt-0 order-first md:order-last"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-br from-teal-600 to-amber-600 rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-8 border-white/50 dark:border-slate-800/50 backdrop-blur-sm">
                <img
                  src={MyImage}
                  alt="Omkar Kadam"
                  className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Down Button */}
        <motion.button
          style={{ opacity }}
          onClick={() => scrollToSection('about')}
          aria-label="Scroll to About Section"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        >
          <ArrowDown size={32} className="text-slate-400 dark:text-slate-500" />
        </motion.button>
      </div>
    </section>
  );
}