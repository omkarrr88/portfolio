import { Code2, Globe, Brain, Database, Wrench, Cloud } from 'lucide-react';

export default function Skills() {
  const skillCategories = [
    {
      icon: Code2,
      title: 'Programming Languages',
      skills: ['Python', 'Java', 'JavaScript', 'SQL', 'HTML', 'CSS'],
      color: 'from-teal-600 to-amber-600',
    },
    {
      icon: Globe,
      title: 'Web Development',
      skills: ['Node.js', 'Express.js', 'React', 'Flask', 'RESTful APIs'],
      color: 'from-green-600 to-emerald-600',
    },
    {
      icon: Brain,
      title: 'Machine Learning & AI',
      skills: ['Machine Learning', 'NLP', 'Deep Learning', 'NLTK', 'Scikit-learn', 'TensorFlow', 'OpenCV'],
      color: 'from-orange-600 to-red-600',
    },
    {
      icon: Database,
      title: 'Databases',
      skills: ['MySQL', 'MongoDB'],
      color: 'from-slate-600 to-slate-800',
    },
    {
      icon: Wrench,
      title: 'Development Tools',
      skills: ['Git', 'Visual Studio Code', 'NetBeans', 'SUMO', 'Docker'],
      color: 'from-cyan-600 to-blue-600',
    },
    {
      icon: Cloud,
      title: 'Cloud Platforms',
      skills: ['AWS', 'Google Cloud', 'Oracle Cloud Infrastructure'],
      color: 'from-sky-600 to-indigo-600',
    },
  ];

  return (
    <section id="skills" className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Skills & Expertise
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 group hover:scale-105"
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
                    className="px-3 py-1.5 bg-white text-slate-700 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
