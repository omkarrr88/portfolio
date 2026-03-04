import { GraduationCap, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Education() {
  const education = [
    {
      degree: 'Bachelor of Engineering in Information Technology',
      institution: 'Terna Engineering College',
      location: 'Navi Mumbai, Maharashtra',
      period: 'November 2022 - June 2026',
      university: 'Mumbai University',
      description: 'Final year student specializing in software engineering, machine learning, and web technologies. Active participant in technical societies and leadership roles.',
    },
    {
      degree: 'Higher Secondary Education (CBSE 12th Science)',
      institution: 'D.A.V. Public School',
      location: 'Airoli, Navi Mumbai',
      period: 'June 2020 - July 2022',
      description: 'Completed higher secondary education with a focus on science and mathematics.',
    },
    {
      degree: 'Secondary Education (CBSE 10th)',
      institution: 'D.A.V. Public School',
      location: 'Airoli, Navi Mumbai',
      period: 'May 2020',
      description: 'Completed secondary education with strong academic performance.',
    },
  ];

  return (
    <section id="education" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Education
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-teal-600 to-amber-600 rounded-full mx-auto" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {education.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 md:p-8 group hover:scale-[1.02]"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-teal-600 to-amber-600 rounded-lg text-white group-hover:scale-110 transition-transform flex-shrink-0">
                  <GraduationCap size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {item.degree}
                  </h3>
                  <div className="flex flex-col gap-2 mb-4">
                    <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                      {item.institution}
                    </p>
                    {item.university && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                        {item.university}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{item.period}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
