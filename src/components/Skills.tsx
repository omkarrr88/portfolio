import { Code2, Globe, Brain, Database, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Skills() {
  const skillCategories = [
    {
      icon: Code2,
      title: 'Programming Languages',
      skills: ['Java', 'Python', 'JavaScript', 'HTML', 'CSS'],
      color: 'from-teal-600 to-amber-600',
    },
    {
      icon: Globe,
      title: 'Web Development',
      skills: ['Full-stack Development', 'Frontend Development', 'Node.js', 'Express.js', 'React', 'Flask'],
      color: 'from-green-600 to-emerald-600',
    },
    {
      icon: Brain,
      title: 'Machine Learning & AI',
      skills: ['Machine Learning', 'Natural Language Processing', 'Deep Learning', 'NLTK', 'Scikit-learn', 'TensorFlow', 'Pandas', 'NumPy'],
      color: 'from-orange-600 to-red-600',
    },
    {
      icon: Database,
      title: 'Databases',
      skills: ['MySQL', 'MongoDB'],
      color: 'from-slate-600 to-slate-800',
    },
    {
      icon: Cloud,
      title: 'Cloud platforms',
      skills: ['Google Cloud', 'AWS', 'Docker'],
      color: 'from-sky-600 to-indigo-600',
    },
  ];

  return (
    <section id="skills" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Skills & Expertise
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {skillCategories.map((category, index) => (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 group hover:scale-105"
            >
              <div className={`inline-flex p-3 bg-gradient-to-br ${category.color} rounded-lg text-white mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
