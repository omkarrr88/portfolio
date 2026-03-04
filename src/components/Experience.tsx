import { Briefcase, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Experience() {
  const experiences = [
    {
      role: 'Platform Engineer',
      organization: 'Riamona Luxury and Fashion Brands Pvt. Ltd.',
      location: 'Navi Mumbai, India',
      period: 'Jan 2026 - Present',
      description: 'Responsible for designing, building, and maintaining the core technology platform that supports the company\'s luxury and fashion brand operations.',
      achievements: [
        'Collaborate with cross-functional teams to develop scalable infrastructure and ensure seamless deployment of web and backend services.',
        'Contribute to automation, CI/CD pipelines, and cloud-based solutions to improve platform reliability and performance.'
      ],
      color: 'from-amber-600 to-orange-600',
    }
  ];

  return (
    <section id="experience" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Professional Experience
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-3xl mx-auto">
            My professional journey in building scalable platforms and engineering solutions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {experiences.map((exp, index) => (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 md:p-8 group hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-gradient-to-br ${exp.color} rounded-lg text-white group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <Briefcase size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {exp.role}
                      </h3>
                      <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                        {exp.organization}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{exp.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                      <TrendingUp size={18} />
                      <span>Key Achievements</span>
                    </div>
                    <ul className="space-y-2 ml-6">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li
                          key={achIndex}
                          className="text-slate-700 dark:text-slate-300 flex items-start gap-2"
                        >
                          <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
